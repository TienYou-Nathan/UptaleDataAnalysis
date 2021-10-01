self.importScripts("utilities.js")
self.importScripts("workerManager.js")

const sqlWorker = workerManager(new Worker("/worker.sql-wasm.js"));
let isReady = sqlWorker.send({
    id: sqlWorker.id++,
    action: "open",
}).then(async () => {
    tableCreation = []
    scenesCreation = []

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `CREATE TABLE IF NOT EXISTS Categories (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name TEXT,
                Color TEXT
            )`,
    })
    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `CREATE TABLE IF NOT EXISTS Themes (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name TEXT,
                Color TEXT
            )`,
    })

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `CREATE TABLE IF NOT EXISTS Scenes (
                    Id TEXT NOT NULL PRIMARY KEY,
                    Name TEXT,
                    CategoryId INTEGER,
                    ThemeId INTEGER,
                    FOREIGN KEY(CategoryId) REFERENCES Categories(Id),
                    FOREIGN KEY(ThemeId) REFERENCES Themes(Id)
                )`,
    })

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `CREATE TABLE IF NOT EXISTS QCM (
                    Id TEXT NOT NULL,
                    Name TEXT,
                    SceneId TEXT NOT NULL,
                    FOREIGN KEY(SceneId) REFERENCES Scenes(Id)
                    PRIMARY KEY(Id, SceneId)
                )`,
    })

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `CREATE TABLE IF NOT EXISTS Users (
                Id TEXT PRIMARY KEY,
                Name TEXT
            )`,
    })
    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `CREATE TABLE IF NOT EXISTS Sessions (
                    Id TEXT PRIMARY KEY,
                    UserId TEXT,
                    StartTime TEXT,
                    EndTime TEXT,
                    FOREIGN KEY (UserId) REFERENCES Users(Id)
                )`,
    })

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `CREATE TABLE IF NOT EXISTS QCMAnswers (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    TagId TEXT,
                    SessionId TEXT,
                    Timestamp TEXT,
                    IsCorrect TEXT,
                    Answer TEXT,
                    FOREIGN KEY(TagId) REFERENCES QCM(Id),
                    FOREIGN KEY(SessionId) REFERENCES Sessions(Id)
                )`,
    })

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `CREATE TABLE IF NOT EXISTS SceneVisit (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    SessionId TEXT,
                    StartTime TEXT,
                    EndTIme TEXT,
                    FOREIGN KEY(SessionId) REFERENCES Sessions(Id)
                )`,
    })
});



function cleanCSVFile(details) {
    //sort data by sessionID and Date to ensure events are in correct order
    details = details.sort(
        fieldSorterOptimized(["SessionId", "EventTime"])
    );

    //suppressing duplicate data due to an Uptale bug
    //duplicate matches EventTime, EventName and SessionID
    details = Object.values(details.reduce(
        (accumulator, current) => {
            accumulator[current.SessionId + "|" + JSON.stringify(current.EventTime) + "|" + current.EventName] = current
            return accumulator
        },
        {}
    ));

    //remove all events in a session that fires after a Session_Close event
    //due to uptale bug when VR helmet is put in rest mode
    let currentId = undefined;
    let sessionClosed = false;
    details = details.filter((e) => {
        if (currentId == e.SessionId) {
            if (sessionClosed) {
                return false;
            } else {
                if (e.EventName == "Launch_CloseSession") {
                    sessionClosed = true;
                }
            }
        } else {
            currentId = e.SessionId;
            sessionClosed = false;
        }
        return true;
    });
    delete currentId;
    delete sessionClosed;

    //sort data by sessionID and Date to ensure events are in correct order
    details.forEach((e) => {
        e.EventTime = new Date(e.EventTime);
    });

    return details
}


async function extractScenes(details) {
    //Get Scenes from csv object
    let scenes = Object.values(details.reduce((acc, e) => {
        if (e.SceneId && !acc[e.SceneId]) {
            acc[e.SceneId] = { SceneId: e.SceneId, SceneName: e.SceneName }
        }
        return acc
    }, {}))

    //Insert Scenes into SQLite Database
    let insertion = []
    scenes.forEach(singleScene => {
        insertion.push(sqlWorker.send({
            id: sqlWorker.id++,
            action: "exec",
            sql: "INSERT INTO Scenes (Id, Name) VALUES ($id, $name)",
            params: { $id: singleScene.SceneId, $name: singleScene.SceneName }
        }));
    })

    Promise.all(insertion).catch(err => {
        throw err;
    })

    await Promise.all(insertion)
}
async function extractQCM(details) {

}

async function extractUsers(details) {
    let users = Object.values(details.reduce((acc, e) => {
        if (e.LearnerName && !acc[e.LearnerName]) {
            acc[e.LearnerName] = { LearnerName: e.LearnerName, LearnerId: e.LearnerId }
        }
        return acc
    }, {}))

    //Insert Scenes into SQLite Database
    let insertion = []
    users.forEach(singleUser => {
        insertion.push(sqlWorker.send({
            id: sqlWorker.id++,
            action: "exec",
            sql: "INSERT INTO Users (Id) VALUES ($id)",
            params: { $id: singleUser.LearnerName }
        }));
    })

    Promise.all(insertion).catch(err => {
        throw err;
    })

    await Promise.all(insertion)
}
async function extractSessions(details) {

    details = details.filter(e =>
        e.EventName != "Launch_HeatMap" && e.EventName != "Launch_TopicClick"
    )
    //Separate all sessions by regrouping all data by sessionID
    let sessions = details.reduce((acc, e) => {
        if (!acc[e.SessionId]) {
            acc[e.SessionId] = {}
            acc[e.SessionId].SessionId = e.SessionId
            acc[e.SessionId].LearnerName = e.LearnerName
            acc[e.SessionId].actions = []
        }
        acc[e.SessionId].actions.push(e)
        return acc
    }, {})
    sessions = Object.values(sessions)

    //Insert Scenes into SQLite Database
    let insertion = []

    sessions.forEach(singleSession => {
        insertion.push(sqlWorker.send({
            id: sqlWorker.id++,
            action: "exec",
            sql: "INSERT INTO Sessions (Id, UserId, StartTime, EndTime) VALUES ($id, $userId, $startTime, $endTime)",
            params: { $id: singleSession.SessionId, $userId: singleSession.LearnerName, $startTime: singleSession.actions[0].EventTime.getTime(), $endTime: singleSession.actions.at(-1).EventTime.getTime() }
        }));
    })

    Promise.all(insertion).catch(err => {
        throw err;
    })

    await Promise.all(insertion)
}


async function test() {
    //List All Tables
    let tables = (await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `SELECT * FROM sqlite_master WHERE type='table';`,
    }))
    console.log("tables", tables.results[0].columns)
    console.table(tables.results[0].values, [0, 1, 2])

    let scenes = (await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `SELECT * FROM Scenes;`,
    }))
    console.log("scenes", scenes.results[0].columns)
    console.table(scenes.results[0].values)

    let users = (await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `SELECT * FROM Users;`,
    }))
    console.log("users", users.results[0].columns)
    console.table(users.results[0].values)


    let sessions = (await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `SELECT * FROM Sessions;`,
    }))

    console.log("sessions", sessions.results[0].columns)
    console.table(sessions.results[0].values)
}

onmessage = async (e) => {
    let message = { id: e.data.id }
    await isReady
    if (e.data.action == "extractCSVData") {
        e.data.files.detail = cleanCSVFile(e.data.files.detail)
        await extractScenes(e.data.files.detail);
        extractQCM()

        await extractUsers(e.data.files.detail);
        await extractSessions(e.data.files.detail);
        test()
        return
    }
    message.action = e.data.action
    postMessage(message)
}
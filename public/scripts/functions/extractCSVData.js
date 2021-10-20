//This file contains all functions related to import data from the CSV file to the database


async function initializeDB() {
    tableCreation = [];
    scenesCreation = [];

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `CREATE TABLE IF NOT EXISTS Categories (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name TEXT,
                Color TEXT
            )`,
    });
    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `CREATE TABLE IF NOT EXISTS Themes (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name TEXT,
                Color TEXT
            )`,
    });

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `CREATE TABLE IF NOT EXISTS Scenes (
                    Id TEXT NOT NULL PRIMARY KEY,
                    Name TEXT,
                    CategoryId INTEGER,
                    ThemeId INTEGER,
                    FOREIGN KEY(CategoryId) REFERENCES Categories(Id) ON DELETE CASCADE,
                    FOREIGN KEY(ThemeId) REFERENCES Themes(Id) ON DELETE CASCADE
                )`,
    });

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `CREATE TABLE IF NOT EXISTS QCM (
                    Id TEXT NOT NULL,
                    Name TEXT,
                    SceneId TEXT NOT NULL,
                    FOREIGN KEY(SceneId) REFERENCES Scenes(Id),
                    PRIMARY KEY(Id, SceneId)
                )`,
    })

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `CREATE TABLE IF NOT EXISTS Topics (
                    Id TEXT NOT NULL,
                    Name TEXT,
                    SceneId TEXT NOT NULL,
                    Type TEXT NOT NULL,
                    FOREIGN KEY(SceneId) REFERENCES Scenes(Id),
                    PRIMARY KEY(Id, SceneId)
                )`,
    });

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `CREATE TABLE IF NOT EXISTS UsersGroups (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Name TEXT,
                Color TEXT,
                Type TEXT
            )`,
    });

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `CREATE TABLE IF NOT EXISTS Users (
                Id TEXT PRIMARY KEY,
                Name TEXT,
            )`,
    });

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `CREATE TABLE IF NOT EXISTS UserGroupAssociation (
            UserId TEXT,
            UserGroupId INTEGER,
            FOREIGN KEY(UserId) REFERENCES Users(Id),
            FOREIGN KEY(UserGroupId) REFERENCES UsersGroups(Id),
            PRIMARY KEY(UserId, UserGroupId)
        );`,
    });

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `CREATE TABLE IF NOT EXISTS Sessions (
                    Id TEXT PRIMARY KEY,
                    UserId TEXT,
                    StartTime TEXT,
                    EndTime TEXT,
                    FOREIGN KEY (UserId) REFERENCES Users(Id)
                )`,
    });



    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `CREATE TABLE IF NOT EXISTS QCMAnswers (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    TagId TEXT,
                    SessionId TEXT,
                    Timestamp TEXT,
                    IsCorrect INTEGER,
                    Answer TEXT,
                    FOREIGN KEY(TagId) REFERENCES QCM(Id),
                    FOREIGN KEY(SessionId) REFERENCES Sessions(Id)
                )`,
    })

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql:
            `CREATE TABLE IF NOT EXISTS TopicsClicks (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    TopicId TEXT,
                    SessionId TEXT NOT NULL,
                    Timestamp TEXT NOT NULL,
                    FOREIGN KEY(SessionId) REFERENCES Sessions(Id),
                    FOREIGN KEY (TopicId) REFERENCES Topic(Id)
                )`,
    });

    await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `CREATE TABLE IF NOT EXISTS SceneVisit (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    SessionId TEXT,
                    EnterTime TEXT,
                    SceneId TEXT,
                    FOREIGN KEY(SessionId) REFERENCES Sessions(Id),
                    FOREIGN KEY(SceneId) REFERENCES Scenes(Id)
                )`,
    });
}

var globalDataStruct = {
    _sessions: null,
    _sessionsWithScenes: null,
    _sessionsWithQCMScenes: null,
    reset() {
        delete this._sessions;
    },
    getSessions(details, force = false) {
        if (!this._sessions || force) {
            this._sessions = Object.values(
                details.reduce((acc, e) => {
                    if (!acc[e.SessionId]) {
                        acc[e.SessionId] = {};
                        acc[e.SessionId].SessionId = e.SessionId;
                        acc[e.SessionId].LearnerName = e.LearnerName;
                        acc[e.SessionId].actions = [];
                    }
                    acc[e.SessionId].actions.push(e);
                    return acc;
                }, {})
            );
        }
        return this._sessions;
    },
    getSessionsWithScenes(details, force = false) {
        if (!this._sessionsWithcenes || force) {
            if (!this._sessions) {
                this.getSessions(details);
            }
            let sessions = [...this._sessions];

            sessions.forEach((e) => {
                let indexesOfChangeWorld = e.actions.reduce((acc, val, index) => {
                    if (val.EventName == "Launch_ChangeWorld") {
                        acc.push(index);
                    }
                    return acc;
                }, []);
                e.scenes = [];
                for (let i = 0; i < indexesOfChangeWorld.length; i++) {
                    let currentSceneActions = e.actions.slice(
                        indexesOfChangeWorld[i],
                        indexesOfChangeWorld[i + 1]
                    );
                    e.scenes.push(currentSceneActions);
                }
            });
            this._sessionsWithcenes = sessions;
        }
        return this._sessionsWithcenes;
    },
    getSessionsWithQCMScenes(details, force = false) {
        if (!this._sessionsWithQCMScenes || force) {
            if (!this._sessions) {
                this.getSessions(details);
            }
            let sessions = [...this._sessions];

            sessions.forEach((e) => {
                let indexesOfChangeWorld = e.actions.reduce((acc, val, index) => {
                    if (val.EventName == "Launch_ChangeWorld") {
                        acc.push(index);
                    }
                    return acc;
                }, []);
                e.scenes = [];
                for (let i = 0; i < indexesOfChangeWorld.length; i++) {
                    let currentSceneActions = e.actions.slice(
                        indexesOfChangeWorld[i],
                        indexesOfChangeWorld[i + 1]
                    );
                    let currentSceneQCMs = currentSceneActions.filter(
                        (e) => e.EventName == "Launch_QcmAnswerClick"
                    );
                    if (currentSceneQCMs.length > 0) {
                        let currentScene = {
                            scene: currentSceneActions[0].SceneId,
                            zonesFound: currentSceneActions.filter(
                                (e) => e.EventName == "Launch_QcmAnswerClick"
                            ),
                            zonesScored: currentSceneActions.filter(
                                (e) => e.EventName == "Launch_WinStar"
                            ),
                            actions: currentSceneActions,
                            QCMs: currentSceneQCMs,
                        };
                        e.scenes.push(currentScene);
                    }
                }
            });
            this._sessionsWithQCMScenes = sessions;
        }
        return this._sessionsWithQCMScenes;
    },
};

async function extractScenes(details) {
    //Get Scenes from csv object
    let scenes = Object.values(
        details.reduce((acc, e) => {
            if (e.SceneId && !acc[e.SceneId]) {
                acc[e.SceneId] = { SceneId: e.SceneId, SceneName: e.SceneName };
            }
            return acc;
        }, {})
    );

    //Insert Scenes into SQLite Database
    let insertion = [];
    scenes.forEach((singleScene) => {
        insertion.push(
            sqlWorker.send({
                id: sqlWorker.id++,
                action: "exec",
                sql: "INSERT INTO Scenes (Id, Name) VALUES ($id, $name)",
                params: { $id: singleScene.SceneId, $name: singleScene.SceneName },
            })
        );
    });

    Promise.all(insertion).catch((err) => {
        throw err;
    });

    await Promise.all(insertion);
}
async function extractQCM(details) {
    //Separate all sessions by regrouping all data by sessionID
    //Iterate through every session and separate scenes
    let sessions = globalDataStruct.getSessionsWithQCMScenes(details);

    //Now we have an array of sessions. We want an array of scenes in which we can see all QCM
    let QCMbyScenes = sessions.reduce((acc, session) => {
        session.scenes.forEach((scene) => {
            if (!acc[scene.scene]) {
                acc[scene.scene] = {};
            }
            scene.QCMs.forEach((QCM) => {
                acc[scene.scene][QCM.TagId] = QCM.TagName;
            });
        });
        return acc;
    }, {});

    let insertion = [];
    for (let [scene, QCMs] of Object.entries(QCMbyScenes)) {
        for (let [QCMId, QCMName] of Object.entries(QCMs)) {
            insertion.push(
                sqlWorker.send({
                    id: sqlWorker.id++,
                    action: "exec",
                    sql:
                        "INSERT INTO QCM (Id, Name, SceneId) VALUES ($id, $name, $sceneId)",
                    params: { $id: QCMId, $name: QCMName, $sceneId: scene },
                })
            );
        }
    }
    Promise.all(insertion).catch((err) => {
        throw err;
    });

    await Promise.all(insertion);
}

async function extractTopics(details) {
    //Get all unqiue topics
    let topics = Object.values(details.filter(e => e.EventName == "Launch_TopicClick").reduce((acc, e) => {
        if (!acc[e.TagId]) {
            acc[e.TagId] = { TagName: e.TagName, TagType: e.TagType, SceneId: e.SceneId, TagId: e.TagId }
        }
        return acc
    }, {}))

    let insertion = [];
    topics.forEach((singleTopic) => {
        insertion.push(
            sqlWorker.send({
                id: sqlWorker.id++,
                action: "exec",
                sql: "INSERT INTO Topics (Id, Name, Type, SceneId) VALUES ($id, $name, $type, $sceneId)",
                params: { $id: singleTopic.TagId, $name: singleTopic.TagName, $type: singleTopic.TagType, $sceneId: singleTopic.SceneId },
            })
        );
    });

    Promise.all(insertion).catch((err) => {
        throw err;
    });
    await Promise.all(insertion);
}

async function extractUsers(details) {
    let users = Object.values(
        details.reduce((acc, e) => {
            if (e.LearnerName && !acc[e.LearnerName]) {
                acc[e.LearnerName] = {
                    LearnerName: e.LearnerName,
                    LearnerId: e.LearnerId,
                };
            }
            return acc;
        }, {})
    );

    //Insert Scenes into SQLite Database
    let insertion = [];
    users.forEach((singleUser) => {
        insertion.push(
            sqlWorker.send({
                id: sqlWorker.id++,
                action: "exec",
                sql: "INSERT INTO Users (Id) VALUES ($id)",
                params: { $id: singleUser.LearnerName },
            })
        );
    });

    Promise.all(insertion).catch((err) => {
        throw err;
    });

    await Promise.all(insertion);
}
async function extractSessions(details) {
    //Separate all sessions by regrouping all data by sessionID
    let sessions = globalDataStruct.getSessions(details);
    //Insert Scenes into SQLite Database
    let insertion = [];

    sessions.forEach((singleSession) => {
        insertion.push(
            sqlWorker.send({
                id: sqlWorker.id++,
                action: "exec",
                sql:
                    "INSERT INTO Sessions (Id, UserId, StartTime, EndTime) VALUES ($id, $userId, $startTime, $endTime)",
                params: {
                    $id: singleSession.SessionId,
                    $userId: singleSession.LearnerName,
                    $startTime: singleSession.actions[0].EventTime.getTime(),
                    $endTime: singleSession.actions[singleSession.actions.length - 1].EventTime.getTime(),
                },
            })
        );
    });

    Promise.all(insertion).catch((err) => {
        throw err;
    });

    await Promise.all(insertion);
}
async function extractQCMAnswers(details) {
    //Separate all sessions by regrouping all data by sessionID
    //Iterate through every session and separate scenes
    let sessions = globalDataStruct.getSessionsWithQCMScenes(details);

    let insertion = [];
    sessions.forEach((session) => {
        session.scenes.forEach((scene) => {
            scene.zonesScored.forEach((zoneScored) => {
                let zone = scene.zonesFound.find((e) => e.TagId == zoneScored.TagId);
                if (zone) zone.isCorrect = true;
            });
            delete scene.zonesScored;
            scene.zonesFound.forEach((zoneFound) => {
                insertion.push(
                    sqlWorker.send({
                        id: sqlWorker.id++,
                        action: "exec",
                        sql:
                            "INSERT INTO QCMAnswers (TagId, SessionId, Timestamp, IsCorrect, Answer) VALUES ($tagId, $sessionId, $timestamp, $isCorrect, $answer)",
                        params: {
                            $tagId: zoneFound.TagId,
                            $sessionId: session.SessionId,
                            $timestamp: zoneFound.EventTime.getTime(),
                            $isCorrect: zoneFound.isCorrect ? 1 : 0,
                            $answer: zoneFound.Answer,
                        },
                    })
                );
            });
        });
    });
    Promise.all(insertion).catch((err) => {
        throw err;
    });

    await Promise.all(insertion);
}

async function extractSceneVisits(details) {
    let insertion = [];
    globalDataStruct.getSessionsWithScenes(details).forEach((session) => {
        session.scenes.forEach((scene) => {
            insertion.push(
                sqlWorker.send({
                    id: sqlWorker.id++,
                    action: "exec",
                    sql:
                        "INSERT INTO SceneVisit (SessionId, EnterTime, SceneId) VALUES ($sessionId, $enterTime, $sceneId)",
                    params: {
                        $sessionId: session.SessionId,
                        $enterTime: scene[0].EventTime.getTime(),
                        $sceneId: scene[0].SceneId,
                    },
                })
            );
        });
    });

    Promise.all(insertion).catch((err) => {
        throw err;
    });

    await Promise.all(insertion);
}

async function extractTopicClicks(details) {
    let insertion = []
    details.filter(e => e.EventName == "Launch_TopicClick").forEach(singleTopicClick => {
        insertion.push(
            sqlWorker.send({
                id: sqlWorker.id++,
                action: "exec",
                sql: "INSERT INTO TopicsClicks ( TopicId, SessionId, Timestamp) VALUES ($topicId, $sessionId, $timestamp)",
                params: { $topicId: singleTopicClick.TagId, $sessionId: singleTopicClick.SessionId, $timestamp: singleTopicClick.EventTime.getTime() },
            })
        );
    })

    Promise.all(insertion).catch((err) => {
        throw err;
    });
    await Promise.all(insertion);
}

async function test() {
    //List All Tables
    let tables = await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `SELECT * FROM sqlite_master WHERE type='table';`,
    });
    console.log("tables", tables.results[0].columns);
    console.table(tables.results[0].values, [0, 1, 2]);

    let scenes = await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `SELECT * FROM Scenes;`,
    });
    console.log("scenes", scenes.results[0].columns);
    console.table(scenes.results[0].values);

    let users = await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `SELECT * FROM Users;`,
    });
    console.log("users", users.results[0].columns);
    console.table(users.results[0].values);

    let sessions = await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `SELECT * FROM Sessions;`,
    });

    console.log("sessions", sessions.results[0].columns);
    console.table(sessions.results[0].values);

    let QCM = await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `SELECT * FROM QCM;`,
    });
    console.log("QCM", QCM.results[0].columns);
    console.table(QCM.results[0].values);

    let Topics = await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `SELECT * FROM Topics;`,
    });
    console.log("Topics", Topics.results[0].columns);
    console.table(Topics.results[0].values);

    let QCMAnswers = await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `SELECT * FROM QCMAnswers;`,
    });
    console.log("QCMAnswers", QCMAnswers.results[0].columns);
    console.table(QCMAnswers.results[0].values);

    let SceneVisit = await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `SELECT * FROM SceneVisit;`,
    });
    console.log(
        "SceneVisit " + SceneVisit.results[0].values.length,
        SceneVisit.results[0].columns
    );
    console.table(SceneVisit.results[0].values);

    let TopicsClicks = await sqlWorker.send({
        id: sqlWorker.id++,
        action: "exec",
        sql: `SELECT * FROM TopicsClicks;`,
    });
    console.log("TopicsClicks", TopicsClicks.results[0].columns);
    console.table(TopicsClicks.results[0].values);
}

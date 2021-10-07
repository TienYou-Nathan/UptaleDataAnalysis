self.importScripts("workerManager.js")
const SQL = new Worker("worker.sql-wasm.js")
const sqlWorker = workerManager(SQL);

self.importScripts("../functions/cleanCSVFile.js")
self.importScripts("../functions/extractCSVData.js")

onmessage = async (e) => {
    let message = { id: e.data.id }
    if (e.data.action == "extractCSVData") {
        globalDataStruct.reset()
        e.data.files.detail = cleanCSVFile(e.data.files.detail)

        await initializeDB()
        await extractScenes(e.data.files.detail);
        await extractQCM(e.data.files.detail);

        await extractUsers(e.data.files.detail);
        await extractSessions(e.data.files.detail);
        await extractQCMAnswers(e.data.files.detail);

        await extractSceneVisits(e.data.files.detail);
        // await test()
    } else if (e.data.action == "debug") {
        message.results = await debug(e.data.sql)
    }
    else if (e.data.action == "export") {
        message.results = (await sqlWorker.send({
            id: sqlWorker.id++,
            action: e.data.action,
        })).buffer
    } else if (e.data.action == "open") {
        message.results = (await sqlWorker.send({
            id: sqlWorker.id++,
            action: e.data.action,
            buffer: e.data.buffer,
        }))
    } else {
        message.results = (await sqlWorker.send({
            id: sqlWorker.id++,
            action: e.data.action,
            sql: e.data.sql,
            params: e.data.params
        })).results
    }
    postMessage(message)
}


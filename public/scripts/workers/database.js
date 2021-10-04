self.importScripts("workerManager.js")
const sqlWorker = workerManager(new Worker("worker.sql-wasm.js"));

self.importScripts("../functions/cleanCSVFile.js")
self.importScripts("../functions/extractCSVData.js")

onmessage = async (e) => {
    let message = { id: e.data.id }
    await isReady
    if (e.data.action == "extractCSVData") {
        globalDataStruct.reset()
        e.data.files.detail = cleanCSVFile(e.data.files.detail)

        await extractScenes(e.data.files.detail);
        await extractQCM(e.data.files.detail);

        await extractUsers(e.data.files.detail);
        await extractSessions(e.data.files.detail);
        await extractQCMAnswers(e.data.files.detail);

        await extractSceneVisits(e.data.files.detail);
        // await test()

        message.buffer = (await sqlWorker.send({
            id: sqlWorker.id++,
            action: "export",
        })).buffer
    } else {
        let sendData = { ...e.data, ...{ id: sqlWorker.id++ } }
        await debug(sendData)
        message.results = await sqlWorker.send(sendData)
    }
    message.action = e.data.action
    postMessage(message)
}
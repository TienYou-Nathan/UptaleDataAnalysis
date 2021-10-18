self.importScripts("WorkerManager.js");
const SQL = new Worker("worker.sql-wasm.js");
const sqlWorker = new WorkerManager(SQL);

self.importScripts("../functions/cleanCSVFile.js");
self.importScripts("../functions/extractCSVData.js");

class Progress {
  id
  constructor(id) {
    this.id = id
  }
  setProgress(number, message = "") {
    postMessage({
      id: this.id,
      type: "progress",
      progress: number,
      message
    });
  }
}


onmessage = async (e) => {
  let message = { id: e.data.id };
  if (e.data.action == "extractCSVData") {
    globalDataStruct.reset();
    e.data.files.detail = cleanCSVFile(e.data.files.detail);
    let progress = new Progress(0)
    progress.setProgress(0 / 9, "Creating Database")
    await initializeDB();
    progress.setProgress(100 / 9, "Extracting Scenes")
    await extractScenes(e.data.files.detail);
    progress.setProgress(200 / 9, "Extracting QCMs")
    await extractQCM(e.data.files.detail);
    progress.setProgress(300 / 9, "Extracting Topics")
    await extractTopics(e.data.files.detail)

    progress.setProgress(400 / 9, "Extracting Users")
    await extractUsers(e.data.files.detail);
    progress.setProgress(500 / 9, "Extracting Sessions")
    await extractSessions(e.data.files.detail);
    progress.setProgress(600 / 9, "Extracting Answers")
    await extractQCMAnswers(e.data.files.detail);

    progress.setProgress(700 / 9, "Extracting Scene Visits")
    await extractSceneVisits(e.data.files.detail);
    progress.setProgress(800 / 9, "Extracting Tags Clicks")
    await extractTopicClicks(e.data.files.detail)
    progress.setProgress(900 / 9)
    //await test()
  } else if (e.data.action == "export") {
    message.results = (
      await sqlWorker.send({
        id: sqlWorker.id++,
        action: e.data.action,
      })
    ).buffer;
  } else if (e.data.action == "open") {
    message.results = await sqlWorker.send({
      id: sqlWorker.id++,
      action: e.data.action,
      buffer: e.data.buffer,
    });
  } else {
    message.results = (
      await sqlWorker.send({
        id: sqlWorker.id++,
        action: e.data.action,
        sql: e.data.sql,
        params: e.data.params,
      })
    ).results;
  }
  postMessage(message);
};

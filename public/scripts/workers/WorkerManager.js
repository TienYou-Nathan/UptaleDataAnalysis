const workerManager = function (worker) {
    const queue = []
    worker.onmessage = data => {
        //resolve promise
        queue[data.data.id].resolve(data.data)
        delete queue[data.data.id]
    }
    worker.onerror = data => {
        queue[data.data.id].reject(data.data)
        delete queue[data.data.id]
    }

    return {
        id: 0,
        send(data) {
            if (data.id == null) {
                throw 'Data sent to worker does not contains an ID'
            }
            if (queue[data.id]) {
                throw 'Duplicate ID in data sent to worker'
            }
            let promise = new Promise((resolve, reject) => {
                worker.postMessage(data)
                queue[data.id] = { resolve, reject }
            })

            return promise
        }
    }
}

class WorkerManager {
    worker;
    _queue = []
    id = 0;
    constructor(_worker) {
        this.worker = _worker;

        this.worker.onmessage = data => {
            //resolve promise
            this._queue[data.data.id].resolve(data.data)
            delete this._queue[data.data.id]
        }

        this.worker.onerror = data => {
            this._queue[data.data.id].reject(data.data)
            delete this._queue[data.data.id]
        }
    }
    send(data) {
        if (data.id == null) {
            throw 'Data sent to worker does not contains an ID'
        }
        if (this._queue[data.id]) {
            throw 'Duplicate ID in data sent to worker'
        }
        let promise = new Promise((resolve, reject) => {
            this.worker.postMessage(data)
            this._queue[data.id] = { resolve, reject }
        })
        return promise
    }
}
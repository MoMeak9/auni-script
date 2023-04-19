// 定义一个 WorkerMessage 类，用于向 Worker 发送消息并处理返回结果
export class WorkerMessage {
    constructor(workerUrl) {
        this.worker = new Worker(workerUrl);
        this.callbacks = new Map();

        // 监听从 Worker 返回的消息
        this.worker.addEventListener('message', event => {
            const {id, type, payload} = event.data;
            const callback = this.callbacks.get(id);

            if (!callback) {
                console.warn(`未知的消息 ID：${id}`);
                return;
            }

            switch (type) {
                case 'SUCCESS':
                    callback.resolve(payload);
                    break;
                case 'ERROR':
                    callback.reject(payload);
                    break;
                default:
                    console.warn('未知的消息类型：', type);
            }

            this.callbacks.delete(id);
        });
    }

    // 发送消息给 Worker
    postMessage(payload) {
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        const message = { id, payload };
        this.worker.postMessage(message);
        return new Promise((resolve, reject) => {
            this.callbacks.set(id, {resolve, reject});
        });
    }

    // 关闭 Worker
    terminate() {
        this.worker.terminate();
    }
}



export default WorkerMessage;

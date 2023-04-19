// 创建一个 WorkerMessage 实例，并指定要加载的 Worker 文件路径
import WorkerMessage from "../index.js";

console.log('WorkerMessage start')

const worker = new WorkerMessage('./worker.js');

// 发送一个消息给 Worker，并处理返回结果
worker.postMessage({ type: 'CALCULATE', payload: 10 }).then(
    result => {
        console.log('计算结果：', result);
    },
    error => {
        console.error('计算出错：', error);
    }
);

// 关闭 Worker 实例
// worker.terminate();

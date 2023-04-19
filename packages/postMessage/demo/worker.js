// 监听从主线程传来的消息
self.addEventListener('message', event => {

    const { id, payload } = event.data;

    switch (payload.type) {
        case 'CALCULATE':
            // 执行计算，并将结果发送给主线程
            const result = doCalculate(payload.payload);
            self.postMessage({ id, type: 'SUCCESS', payload: result });
            break;
        default:
            // 如果收到了未知的消息类型，则向主线程发送错误消息
            const error = `未知的消息类型：${payload.type}`;
            self.postMessage({ id, type: 'ERROR', payload: error });
    }
});

// 执行计算的函数
function doCalculate(num) {
    // 这里可以执行一些复杂的计算任务
    return num * 2;
}

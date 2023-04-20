// 执行计算的函数
function doCalculate(num) {
    // 这里可以执行一些复杂的计算任务
    return num * 2;
}

function doPlus(num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(num + 1);
        }, 1000);
    });
}

let canStructuredClone = true;

class childMessage {
    constructor(self, config) {
        this.self = self;
        this.config = config;
    }

    // 监听从主线程传来的消息
    addEventListener(callback) {
        this.self.addEventListener('message', event => {
            const {id, payload} = event.data;
            const {type} = payload;
            try {
                const res = this.config[type](canStructuredClone ? payload.payload : JSON.parse(payload.payload));
                if (res instanceof Promise) {
                    res.then(data => {
                        this.self.postMessage({
                            id,
                            type: 'SUCCESS',
                            payload: canStructuredClone ? data : JSON.stringify(data)
                        });
                    }).catch(e => {
                        this.self.postMessage({id, type: 'ERROR', payload: e.toString()});
                    });
                } else {
                    this.self.postMessage({
                        id,
                        type: 'SUCCESS',
                        payload: canStructuredClone ? res : JSON.stringify(res)
                    });
                }
            } catch (e) {
                this.self.postMessage({id, type: 'ERROR', payload: e.toString()});
            } finally {
                callback?.();
            }
        });
    }
}

const child = new childMessage(self, {
    CALCULATE: doCalculate,
    PLUS: doPlus
});

// 起到分发执行的效果
child.addEventListener(()=>{
    console.log('worker is listened');
});

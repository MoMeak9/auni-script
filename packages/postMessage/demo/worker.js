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
                const res = this.config[type](payload.payload);
                if (res instanceof Promise) {
                    res.then(data => {
                        this.self.postMessage({id, type: 'SUCCESS', payload: data});
                    }).catch(e => {
                        this.self.postMessage({id, type: 'ERROR', payload: e});
                    });
                } else {
                    this.self.postMessage({id, type: 'SUCCESS', payload: res});
                }
            } catch (e) {
                this.self.postMessage({id, type: 'ERROR', payload: e});
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

child.addEventListener(()=>{
    console.log('worker is listened');
});


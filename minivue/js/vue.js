// import Observer from './observer'

class Vue {
    constructor(options) {
        // 1. 通过属性保存选项的数据
        this.$options = options || {}
        this.$data = this.$options.data || {}
        // document.querySelector(options.el)返回el元素
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
        // 2. 把data中的成员转换成getter和setter，注入到vue实例中
        this._proxyData(this.$data)
        // 3. 调用observer对象，监听数据的变化
        new Observer(this.$data)
        // 4. 调用compiler对象，解析指令和差值表达式
        new Compiler(this)
    }

    _proxyData(data) {
        Object.keys(data).forEach(key => {
            // 把data的属性注入到vue实例中
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get () {
                    return data[key]
                },
                set (newValue) {
                    if (data[key] === newValue) {
                        return
                    }
                    data[key] = newValue
                }
            })
        })
    }
}

// let vm = new Vue({
//     el: '#app',
//     data: {
//       msg: 'Hello Vue',
//       count: 100,
//       person: { name: 'zs' }
//     }
//   })
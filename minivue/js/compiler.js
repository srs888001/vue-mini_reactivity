
class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compile(this.el)
    }

    // 编译模板，处理文本节点和元素节点
    compile (el) {
        let childNodes = el.childNodes
        childNodes.forEach(node => {
            if (this.isTextNode(node)) {
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                this.compileElement(node)
            }

            if (node.childNodes && node.childNodes.length) {
                console.log('node:', node)
                this.compile(node)
            }
        });
    }

    compileText(node) {
        // console.dir 打印对象
        // console.dir(node)
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
          let key = RegExp.$1.trim()
          // value里面可能还有其他数据，所以使用replace          
          node.textContent = value.replace(reg, this.vm[key])
    
          // 创建watcher对象，当数据改变更新视图
          new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
          })
        }
    }

    // 编译元素节点，处理指令
    compileElement (node) {
        
        // 遍历所有的属性节点
        Array.from(node.attributes).forEach(attr => {
            // 判断是否是指令
            let attrName = attr.name
            if (this.isCMD(attrName)) {
                // v-text --> text
                attrName = attrName.substr(2)
                // msg、count
                let key = attr.value
                this.update(node, key, attrName)
            }
        })
    }

    update (node, key, attrName) {
        let updateFn = this[attrName + 'Updater']
        // 使用call知道this对象
        updateFn && updateFn.call(this, node, this.vm[key], key)
      }
    
    // 处理 v-text 指令
    textUpdater (node, value, key) {
        // 设置text
        node.textContent = value

        new Watcher(this.vm, key, (newValue) => {
          node.textContent = newValue
        })
    }

    // v-model
    modelUpdater (node, value, key) {
        // 设置value
        node.value = value

        new Watcher(this.vm, key, (newValue) => {
          node.value = newValue
        })

        // 双向绑定
        node.addEventListener('input', () => {
          this.vm[key] = node.value
        })
    }

    isCMD (attr) {
        return attr.startsWith("v-")
    }

    // 判断节点是否是文本节点
    isTextNode (node) {
        return node.nodeType === 3
    }
    // 判断节点是否是元素节点
    isElementNode (node) {
        return node.nodeType === 1
    }

}
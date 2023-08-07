/**
 * 3. 属性和effect之间是n:n的关系，依赖收集
 * 多个effect之间是嵌套的话，可以用树形结构 this.parent = activeEffect, activeEffect存储当前effect【跟词法解析，嵌套作用域步骤一样】
 */

export let activeEffect = undefined
export class ReactiveEffect {
  parent = undefined 
  // public fn 默认将fn放到类的实例上
  constructor(public fn) {}
  deps = [] // effect中药记录哪些属性是在effect中调用的
  run() {
    // 2. 当运行的时候，我们需要将属性和对应的effect关联起来 (一取值就做依赖收集)
    // 利用js是单线程的特性，先放在全局，再取值; 树形结构; 而vue2是栈收集，用数组push, 不断的pop出来
    try {
      this.parent = activeEffect
      activeEffect = this
      console.log('activeEffect', activeEffect, this.fn);
      
      return this.fn() // 执行回调函数，触发属性的get
    } finally { 
      // 收集完成后清空缓存
      activeEffect = this.parent
      this.parent = undefined
    }
  }
}

export function effect(fn, options: any = {}) {
  // 1. 将用户的函数，拿到变成一个响应式的函数
  const _effect = new ReactiveEffect(fn)
  // 默认让用户的函数执行一次
  // return _effect.run()
  const runner = _effect.run.bind(_effect);
  console.log('runner', runner)
  return runner();

}
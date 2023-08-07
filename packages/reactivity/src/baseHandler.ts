export enum ReactiveFlags {
  "IS_REACTIVE" = "__v_isReactive",
}

export const mutableHandlers = {
  // 原始对象  属性 代理对象
  get(target, key, recevier) {
    console.log('get', target, key, recevier)
    if(key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    // return target[key]    
    return Reflect.get(target, key, recevier) // this指向是receiver, 为什么不用target[key]？ 保证用户修改属性时，可以监控得到
  },
  set(target, key, value, recevier) {
    console.log('set', target, key, value, recevier)
    // return target[key] = value
    return Reflect.set(target, key, value, recevier)
  },
}
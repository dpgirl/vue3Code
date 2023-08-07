import { activeEffect } from "./effect"

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
    track(target, key) // 一取值就收集依赖  
    return Reflect.get(target, key, recevier) // this指向是receiver, 为什么不用target[key]？ 保证用户修改属性时，可以监控得到
  },
  set(target, key, value, recevier) {
    console.log('set', target, key, value, recevier)
    // return target[key] = value
    return Reflect.set(target, key, value, recevier)
  },
}

// 3. 收集依赖：属性和effect是 n:n 的关系
// Map1 = {({ name: 'jw', age: 30 }):Map2}
// Map2 = {name: set()}  每个属性对应的所有effect
// 最终是：{ name: 'jw', age: 30 } -> {name => [effect,effect]}

const targetMap = new WeakMap()
function track(target, key) {
  debugger
  // 当前这个属性是在effect中使用的我才收集，否则不收集
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map())) // 第一个Map
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set())) // 每个属性跟effect关联, dep是数组, 用new set()优点： 1. 去重 2.方便判断
    }
    // 是否应该收集
    let shouldTrack = !dep.has(activeEffect)
    if(shouldTrack) {
      dep.add(activeEffect)
      // 这里让effect也记录一下有哪些属性
      activeEffect.deps.push(dep)
    }
  }
}
console.log('targetMap', targetMap)

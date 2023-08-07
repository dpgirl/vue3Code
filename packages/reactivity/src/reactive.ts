import { isObject } from "@xuewu/shared";
import { mutableHandlers, ReactiveFlags } from "./baseHandler";

export function reactive(target) {
  return createReactiveObject(target)
}

const reactiveMap = new WeakMap(); // 对象与代理的映射关系，防止内存泄露, WeakMap弱引用，Map强引用（变量不会被销毁）

function createReactiveObject(target) {
  if (!isObject(target)) {
    return
  }

  // 标识，如果已经代理过，直接返回对象
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  // 防止同一个对象被代理两次，返回的永远是同一个代理对象
  let exitstingProxy = reactiveMap.get(target)
  if (exitstingProxy) {
    return exitstingProxy
  }

  // 代理对象
  const proxy = new Proxy(target, mutableHandlers)
  // 代理前 代理后做一个映射表  如果用同一个代理对象做代理，直接返回上一次的代理结果
  reactiveMap.set(target, proxy)

  // 代理前 -> 代理后    代理后 -> 代理前【做个标识】
  return proxy
}

// 1.缓存结果 [缓存代理过的对象]
// 2.增添自定义属性
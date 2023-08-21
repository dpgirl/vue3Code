import { isFunction } from "@xuewu/shared";
import { ReactiveEffect, activeEffect } from "./effect";
import { trackEffects, triggerEffects } from "./baseHandler";

class ComputedRefImpl {
  effect
  _value
  dep = new Set() // 依赖
  _dirty = true // 防抖，多次取值，没更新值时，只取一次
  constructor(public getter, public setter) {
    // 计算属性就是一个effect  会让getter中的属性收集这个effect
    this.effect = new ReactiveEffect(getter, () => {
      // 所依赖的值有更新时，会进入这里
      if (!this._dirty) {
        this._dirty = true // 让计算属性标记为脏值
        triggerEffects(this.dep) // 触发更新
      }
    })
  }
  get value() {
    if (activeEffect) {
      // value => [effect, effect] 属性收集依赖
      trackEffects(this.dep)
    }
    // 做限制，多次取值没更新值时，只取一次； 依赖的值有更新时，会走上面的new ReactiveEffect()
    if(this._dirty) {
      this._dirty = false
      // 取值 让getter执行拿到返回值 作为计算属性的值
      this._value = this.effect.run()
    }
    return this._value
  }
  set value(val) {
    // 修改时触发setter
    this.setter(val)
  }
}

export function computed(getterOrOptions) {
  const isGetter  = isFunction(getterOrOptions)
  let getter
  let setter
  // 函数
  if (isGetter) {
    getter = getterOrOptions
    setter = () => {
      console.warn('computed is readonly')
    }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  return new ComputedRefImpl(getter, setter)
}
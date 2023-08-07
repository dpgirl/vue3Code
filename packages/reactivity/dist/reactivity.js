// packages/reactivity/src/effect.ts
var activeEffect = void 0;
var ReactiveEffect = class {
  // public fn 默认将fn放到类的实例上
  constructor(fn) {
    this.fn = fn;
    this.parent = void 0;
    this.deps = [];
  }
  // effect中药记录哪些属性是在effect中调用的
  run() {
    try {
      this.parent = activeEffect;
      activeEffect = this;
      console.log("activeEffect", activeEffect, this.fn);
      return this.fn();
    } finally {
      activeEffect = this.parent;
      this.parent = void 0;
    }
  }
};
function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn);
  const runner = _effect.run.bind(_effect);
  console.log("runner", runner);
  return runner();
}

// packages/shared/src/index.ts
function isObject(val) {
  return typeof val === "object" && val !== null;
}

// packages/reactivity/src/baseHandler.ts
var mutableHandlers = {
  // 原始对象  属性 代理对象
  get(target, key, recevier) {
    console.log("get", target, key, recevier);
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    track(target, key);
    return Reflect.get(target, key, recevier);
  },
  set(target, key, value, recevier) {
    console.log("set", target, key, value, recevier);
    return Reflect.set(target, key, value, recevier);
  }
};
var targetMap = /* @__PURE__ */ new WeakMap();
function track(target, key) {
  debugger;
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = /* @__PURE__ */ new Set());
    }
    let shouldTrack = !dep.has(activeEffect);
    if (shouldTrack) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }
}
console.log("targetMap", targetMap);

// packages/reactivity/src/reactive.ts
function reactive(target) {
  return createReactiveObject(target);
}
var reactiveMap = /* @__PURE__ */ new WeakMap();
function createReactiveObject(target) {
  if (!isObject(target)) {
    return;
  }
  if (target["__v_isReactive" /* IS_REACTIVE */]) {
    return target;
  }
  let exitstingProxy = reactiveMap.get(target);
  if (exitstingProxy) {
    return exitstingProxy;
  }
  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  return proxy;
}
export {
  ReactiveEffect,
  activeEffect,
  effect,
  reactive
};
//# sourceMappingURL=reactivity.js.map

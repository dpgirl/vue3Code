// packages/shared/src/index.ts
function isObject(val) {
  return typeof val === "object" && val !== null;
}

// packages/reactivity/src/index.ts
isObject("abc");
export {
  isObject
};
//# sourceMappingURL=reactivity.js.map

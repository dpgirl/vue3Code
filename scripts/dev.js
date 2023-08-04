// 开发环境搭建

import minimist from "minimist"; // 解析参数
import { fileURLToPath } from "url"; // node 将文件路径转换为路径
import { dirname, resolve } from "path";  // node  resolve查找路径 dirname?
import esbuild from 'esbuild'

// node scripts/dev.js reactivity -f esm
console.log('argv', process.argv, import.meta)
const args = minimist(process.argv.slice(2))
const format = args.f || 'iife'
const target = args._[0] || 'reactivity'

const __dirname = dirname(fileURLToPath(import.meta.url))
console.log('路径', __dirname, resolve(__dirname, '../packages'), 'dirname', dirname)

const IIFENamesMap = {
  'reactivity': 'XuewuReactivity'
}
// 打包监听上下文
esbuild.context({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)], // 入口文件
  outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`), // 输出文件
  bundle: true, // 将所有的文件打包在一起
  sourcemap: true,
  format,
  globalName: IIFENamesMap[target], // 打包命令不给 -f esm, 默认是全局打包 iife
  platform: 'browser'
}).then(ctx => ctx.watch())
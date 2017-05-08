import svelte from 'rollup-plugin-svelte'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  moduleName: 'Playground',
  entry: 'src/index.js',
  dest: 'dist/app.js',
  format: 'umd',
  plugins: [
    svelte(),
    nodeResolve(),
    commonjs()
  ]
}

import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  moduleName: 'Lib',
  entry: 'src/lib.js',
  dest: 'dist/lib.js',
  format: 'iife',
  plugins: [
    nodeResolve(),
    commonjs()
  ]
}

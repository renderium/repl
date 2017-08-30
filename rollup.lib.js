import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/lib.js',
  output: {
  	name: 'Lib',
  	file: 'dist/lib.js',
  	format: 'iife'
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ]
}

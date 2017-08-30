import svelte from 'rollup-plugin-svelte'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    name: 'Playground',
    file: 'dist/app.js',
    format: 'iife'
  },
  external: [
    'lib'
  ],
  'globals': {
    'lib': 'Lib'
  },
  plugins: [
    svelte(),
    nodeResolve(),
    commonjs()
  ]
}

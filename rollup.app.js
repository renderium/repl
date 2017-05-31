import svelte from 'rollup-plugin-svelte'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  moduleName: 'Playground',
  entry: 'src/index.js',
  dest: 'dist/app.js',
  format: 'iife',
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

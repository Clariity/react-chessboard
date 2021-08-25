import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'auto'
    },
    {
      file: pkg.module,
      format: 'esm'
    }
  ],
  plugins: [
    resolve({
      extensions: ['.js', '.jsx']
    }),
    babel({
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/preset-react',
          {
            runtime: 'automatic'
          }
        ]
      ]
    }),
    commonjs()
  ],
  external: ['react', 'react-dom']
};

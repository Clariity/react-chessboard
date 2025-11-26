import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import cleanup from 'rollup-plugin-cleanup';

import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'auto',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      clean: true,
      tsconfig: 'tsconfig.build.json',
    }),
    cleanup({
      comments: 'none',
      extensions: ['ts', 'tsx', 'js', 'jsx'],
    }),
  ],
  external: ['react', 'react-dom', 'react/jsx-runtime'],
};

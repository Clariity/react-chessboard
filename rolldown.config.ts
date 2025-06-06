import { defineConfig } from 'rolldown';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
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
    typescript({
      clean: true,
      tsconfig: 'tsconfig.build.json',
    }),
  ],
  external: ['react', 'react-dom'],
});

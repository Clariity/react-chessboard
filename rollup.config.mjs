import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json" assert { type: "json" };

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "auto",
      },
      {
        file: pkg.module,
        format: "esm",
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      terser(),
      typescript({ useTsconfigDeclarationDir: true, clean: true }),
    ],
    external: ["react", "react-dom"],
  },
];

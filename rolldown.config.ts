import { defineConfig } from "rolldown";
import typescript from "rollup-plugin-typescript2";

export default defineConfig({
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [
    typescript({
      clean: true,
      tsconfig: "tsconfig.build.json",
    }),
  ],
  external: ["react", "react-dom"],
});

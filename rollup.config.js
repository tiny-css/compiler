import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
const { preserveShebangs } = require('rollup-plugin-preserve-shebangs');

/**@type {import("rollup").RollupOptions}*/
const config = {
    input: "./index.ts",
    output: {
        name: "bundle",
        dir: "dist",
        format: "iife",
    },
    plugins: [
        preserveShebangs(),
        commonjs({exclude: "rollup.config.js"}),
        typescript()
    ],
}
export default config;
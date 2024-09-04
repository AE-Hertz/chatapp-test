import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import commonjs from "@rollup/plugin-commonjs";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    build: {
        rollupOptions: {
            plugins: [commonjs()],
        },
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
});

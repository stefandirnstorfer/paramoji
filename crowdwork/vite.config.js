import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dotenv from "dotenv"
import path from "path"

dotenv.config()

const rootDir = path.join(process.cwd(), "src")
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    root: rootDir,
    define: {
        BASE_URL: JSON.stringify(process.env.BASE_URL || "")
    },
    resolve: {
        alias: {
            vue: "vue/dist/vue.esm-bundler.js",
            ["@/"]: path.join(rootDir, "/"),
        },
    },
    build: {
        outDir: path.join(process.cwd(), "dist"),
    },
    server: {
        proxy: {
            "/emoticon-data": {
                target: "http://4d5166.online-server.cloud/",
                changeOrigin: true,
            },
            "/api": {
                target: "http://4d5166.online-server.cloud/",
                secure: false,
                changeOrigin: true,
            },
        },
    },
})

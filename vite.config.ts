/*
 * @FileDesc: vite 配置
 */

import { defineConfig, loadEnv } from "vite"
import { VitePluginNode } from "vite-plugin-node"

/** 获取 .env 文件的环境变量 */
export const VITE_ENV = loadEnv(process.env.NODE_ENV as string, __dirname) as ImportMetaEnv

export default defineConfig({
    server: {
        // 端口号 默认: 5173
        port: Number(VITE_ENV.VITE_PORT),
        // 端口被占用时是否报错退出 默认: false
        strictPort: true
    },
    resolve: {
        // 路径别名
        alias: {
            "@": "/src"
        }
    },
    plugins: [
        ...VitePluginNode({
            // 服务端框架适配器
            adapter: "nest",
            // 应用入口文件
            appPath: "/src/main.ts",
            // 导出应用实例的变量名
            exportName: "app",
            // 输出格式
            outputFormat: "es",
            // ts 编译器
            tsCompiler: "swc",
            // swc 选项
            swcOptions: {
                // 是否压缩
                minify: true,
                // 编译器选项
                jsc: {
                    // 压缩选项
                    minify: {
                        // 是否变量名混淆
                        mangle: true,
                        // 代码压缩选项
                        compress: {
                            // 是否移除所有 console.* 语句
                            drop_console: process.env.NODE_ENV !== "development"
                        }
                    }
                }
            }
        })
    ]
})

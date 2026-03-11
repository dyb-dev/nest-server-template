/*
 * @FileDesc: 环境变量类型声明
 */

interface ImportMetaEnv {
    /** 基础路径 */
    readonly BASE_URL: string
    /** 是否为开发环境 */
    readonly DEV: boolean
    /** 是否为生产环境 */
    readonly PROD: boolean
    /**
     * 当前模式
     * - development: 开发环境
     * - production: 生产环境
     */
    readonly MODE: "development" | "production"
    /** 是否为服务端渲染模式 */
    readonly SSR: boolean

    /** 全局前缀 默认: api */
    readonly VITE_GLOBAL_PREFIX: string
    /** 上传目录 默认: uploads */
    readonly VITE_UPLOAD_DIR: string
    /** 上传前缀 默认: /uploads */
    readonly VITE_UPLOAD_PREFIX: string
    /** 端口号 默认: 3000 */
    readonly VITE_PORT: string
    /** CSRF 令牌密钥 */
    readonly VITE_CSRF_TOKEN_SECRET: string
    /** 访问令牌密钥 */
    readonly VITE_ACCESS_TOKEN_SECRET: string
    /** 刷新令牌密钥 */
    readonly VITE_REFRESH_TOKEN_SECRET: string
    /** HMAC 密钥 */
    readonly VITE_HMAC_SECRET: string
    /** AES 密钥（64 个 hex 字符） */
    readonly VITE_AES_SECRET: string
    /** RSA 公钥 (PKCS#8 PEM 格式) */
    readonly VITE_RSA_PUBLIC_SECRET: string
    /** RSA 私钥 (PKCS#8 PEM 格式) */
    readonly VITE_RSA_PRIVATE_SECRET: string
    /**
     * 数据库连接 URL
     * - 格式: postgresql://用户名:密码@主机:端口/数据库名?schema=模式
     */
    readonly VITE_DATABASE_URL: string
    /**
     * 缓存连接 URL
     * - 格式: redis://用户名:密码@主机:端口/数据库编号
     */
    readonly VITE_CACHE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

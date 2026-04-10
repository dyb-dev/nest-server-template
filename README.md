<div align="center">

# 🚀 Nest Server Template

**基于 NestJS 全家桶搭建的企业级服务端开发模板**

[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D8.15.5-blue)](https://pnpm.io/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7+-DC382D)](https://redis.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## 📖 项目简介

`Nest Server Template` 是一套面向企业级应用的 NestJS 后端开发模板，开箱即用地集成了认证授权、权限管理、安全防护、监控审计、定时调度等通用能力，配合规范化的工程结构与编码约束，帮助团队快速搭建稳定、安全、可扩展的服务端应用。

---

## ✨ 功能特性

### 🏗️ 架构设计

- 采用 `PostgreSQL` + `Prisma ORM` + `Redis` 技术架构
- 采用 `Auth` / `Core` / `Shared` / `System` / `Monitor` / `Scheduler` 六层模块化架构
- 采用 `Controller` / `DTO` / `Module` / `Repository` / `Service` 五层结构规范
- 采用全局异常过滤器，统一捕获并处理全局错误
- 采用统一业务响应码体系，规范化响应数据格式
- 采用通用 DTO 封装设计（响应、分页、加解密、验证码等）
- 采用基于 `nestjs-cls` + `@nestjs-cls/transactional` 的声明式事务支持
- 采用软删除设计（基于时间戳，避免唯一索引冲突）

### 📦 基础设施

- 采用 `nestjs-pino` 结构化日志，支持开发美化输出与生产滚动归档
- 采用 `BullMQ` 消息队列，基于 Redis 提供异步任务能力
- 采用 `cron` 定时任务调度，支持系统任务与业务任务统一管理
- 采用 `@nestjs/axios` HTTP 客户端封装，全局统一超时配置
- 采用 `cache-manager` + `@keyv/redis` 多层缓存抽象
- 内置 `multer` 文件上传与静态资源托管
- 内置 `svg-captcha` 图形验证码生成与校验
- 内置 `request-ip` + `ipaddr.js` 真实客户端 IP 识别
- 内置 `ua-parser-js` 浏览器与操作系统识别
- 内置 `systeminformation` 服务器硬件与运行状态监控

### 🔐 安全体系

- 采用 `csrf-csrf` Double Submit Cookie CSRF 防护
- 采用 `Access Token` + `Refresh Token` 双令牌认证
- 采用 `RSA` + `AES` 混合加解密体系，实现请求/响应端到端加密
- 采用 `Helmet` 加固 HTTP 安全响应头
- 采用 `@nestjs/throttler` 接口限流
- 内置基于 `x-timestamp` + `x-nonce` 的防重放攻击防护
- 内置基于 `bcrypt` 的密码加盐哈希存储
- 内置基于角色 + 权限标识的 RBAC 鉴权
- 内置敏感字段自动脱敏拦截器
- 内置登录会话集中管理，支持强制下线

### 🛠️ 工程化

- 采用 `Vite` + `vite-plugin-node` + `SWC` 驱动开发热更新与生产编译压缩
- 采用 `ESLint` + `Prettier` 双层代码规范化
- 采用 `Husky` + `lint-staged` Git 提交前自动化检查与格式化
- 采用 `@dyb-dev/project-cli` 一键发布与版本管理
- 全量 `TypeScript`，严格类型推导与路径别名（`@/*`）
- 采用 `.env` + `.env.development` + `.env.production` 多环境变量隔离

---

## 🗂️ 项目结构

```md
nest-server-template
├── prisma/
│ ├── migrations/ # 数据库迁移文件
│ ├── schema.prisma # 数据模型定义
│ └── seed.ts # 种子数据脚本
├── src/
│ ├── constants/ # 全局常量
│ ├── decorators/ # 全局装饰器
│ ├── dtos/ # 全局 DTO
│ ├── exception-filters/ # 全局异常过滤器
│ ├── exceptions/ # 全局异常类
│ ├── guards/ # 全局守卫
│ ├── interceptors/ # 全局拦截器
│ ├── middlewares/ # 全局中间件
│ ├── modules/
│ │ ├── auth/ # 认证模块
│ │ ├── core/ # 核心模块
│ │ │ ├── cache/ # Redis 缓存
│ │ │ ├── database/ # Prisma 数据库
│ │ │ └── logger/ # Pino 日志
│ │ ├── monitor/ # 监控模块
│ │ │ ├── cache/ # 缓存监控
│ │ │ ├── health/ # 健康检查
│ │ │ ├── login-log/ # 登录日志
│ │ │ ├── login-session/ # 在线会话
│ │ │ ├── operation-log/ # 操作日志
│ │ │ └── server/ # 服务器监控
│ │ ├── scheduler/ # 调度模块
│ │ │ ├── job/ # 定时任务
│ │ │ └── job-log/ # 任务日志
│ │ ├── shared/ # 共享模块
│ │ │ ├── captcha/ # 图形验证码
│ │ │ ├── crypto/ # 加解密服务
│ │ │ ├── csrf/ # CSRF 服务
│ │ │ ├── file/ # 文件上传
│ │ │ ├── location/ # IP 定位
│ │ │ ├── permission/ # 权限服务
│ │ │ ├── replay/ # 防重放服务
│ │ │ └── user-agent/ # UA 解析
│ │ └── system/ # 系统模块
│ │ ├── config/ # 参数配置
│ │ ├── dept/ # 部门管理
│ │ ├── dict-type/ # 字典类型
│ │ ├── dict-item/ # 字典数据
│ │ ├── menu/ # 菜单管理
│ │ ├── notice/ # 通知公告
│ │ ├── post/ # 岗位管理
│ │ ├── profile/ # 个人中心
│ │ ├── role/ # 角色管理
│ │ ├── user/ # 用户管理
│ │ └── ... # 用户角色/岗位/部门关系等
│ ├── pipes/ # 全局管道
│ ├── prisma/ # Prisma Client 生成产物
│ ├── types/ # 全局类型
│ ├── utils/ # 全局工具函数
│ ├── app.module.ts # 根模块
│ └── main.ts # 应用入口
├── .env # 全局环境变量
├── .env.development # 开发环境变量
├── .env.production # 生产环境变量
├── prisma.config.ts # Prisma 配置
└── vite.config.ts # Vite 配置
```

---

## 🔧 环境要求

| 工具       | 版本要求             |
| ---------- | -------------------- |
| Node.js    | `>= 22.0.0`          |
| pnpm       | `>= 8.15.5 < 10.0.0` |
| PostgreSQL | `>= 16`              |
| Redis      | `>= 7`               |

---

## 🚀 快速上手

### 1. 准备开发环境

**PostgreSQL**

下载并安装 PostgreSQL，启动数据库服务，推荐使用 [Navicat Premium](https://www.navicat.com/) 作为数据库可视化管理工具。

**Redis**

下载并安装 Redis，启动 Redis 服务，推荐使用 [Redis Insight](https://redis.io/insight/) 作为 Redis 可视化管理工具。

**Postman**

推荐使用 [Postman](https://www.postman.com/) 进行接口调试。

### 2. 配置环境变量

项目采用多环境变量文件隔离，请按需修改：

- `.env`：全局公共配置
- `.env.development`：**开发环境**密钥与连接串
- `.env.production`：**生产环境**密钥与连接串

> ⚠️ **安全提示**：模板中预置的密钥仅用于演示，**正式使用前必须全部替换**：
>
> - `VITE_CSRF_TOKEN_SECRET`：CSRF 令牌密钥
> - `VITE_ACCESS_TOKEN_SECRET`：访问令牌密钥
> - `VITE_REFRESH_TOKEN_SECRET`：刷新令牌密钥
> - `VITE_RSA_PUBLIC_SECRET` / `VITE_RSA_PRIVATE_SECRET`：RSA 密钥对（PKCS#8 PEM）
> - `VITE_AES_SECRET`：AES 密钥（64 位 hex）
> - `VITE_HMAC_SECRET`：HMAC 密钥
> - `VITE_DATABASE_URL` / `VITE_CACHE_URL`：数据库与 Redis 连接串

### 3. 安装依赖

```bash
pnpm install
```

### 4. 数据库迁移与种子数据

```bash
# 执行迁移并生成 Prisma Client
pnpm migrate:dev

# 初始化种子数据
pnpm db:seed:dev
```

### 5. 启动开发服务

```bash
pnpm dev
```

### 6. 访问服务

服务默认运行在 `http://localhost:3000/api`

### 7. 默认管理员账号

种子数据会自动创建超级管理员账号，可直接使用以下凭据登录：

| 字段     | 值             |
| -------- | -------------- |
| 用户名   | `admin`        |
| 初始密码 | `Admin@123456` |

---

## 🛠️ 常用命令

```bash
# ========== 开发与构建 ==========
pnpm dev                  # 启动开发服务
pnpm ts-check             # TypeScript 类型检查
pnpm build                # 类型检查 + 生产构建
pnpm build-only           # 仅生产构建
pnpm start                # 启动生产服务

# ========== 代码规范 ==========
pnpm format               # 格式化代码（Prisma + Prettier + ESLint）

# ========== 数据库迁移 ==========
pnpm migrate:dev          # 开发环境迁移并生成 Client
pnpm migrate:deploy       # 生产环境迁移并生成 Client
pnpm migrate:reset        # 重置数据库（仅开发环境）

# ========== 种子数据 ==========
pnpm db:seed:dev          # 开发环境初始化种子数据
pnpm db:seed:deploy       # 生产环境初始化种子数据

# ========== 数据库可视化 ==========
pnpm studio               # 打开 Prisma Studio

# ========== 版本发布 ==========
pnpm release              # 一键版本升级 & Git 提交
```

---

## 🤝 参与贡献

欢迎提交 [Issue](https://github.com/dyb-dev/nest-server-template/issues) 和 Pull Request 参与贡献！

---

## 📄 开源协议

本项目基于 [MIT License](./LICENSE) 开源。

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

`Nest Server Template` 是一套面向企业级应用的 NestJS 后端开发模板，内置了大量开箱即用的安全机制、通用模块与工程化配置，帮助团队快速搭建稳定、安全、可扩展的服务端应用。

---

## ✨ 功能特性

### 🏗️ 架构设计

- 采用 PostgreSQL + Prisma ORM + Redis 技术架构
- 采用 `Core` / `Shared` / `System` / `Auth` 四层模块化架构
- 采用 `Controller` / `DTO` / `Module` / `Repository` / `Service` 五层结构规范
- 采用全局异常过滤器，统一捕获并处理全局错误
- 完善业务响应码，统一响应数据格式
- 采用通用 DTO 封装设计
- 采用声明式事务支持

### 📦 基础设施

- 采用 Pino 结构化日志
- 采用 BullMQ 消息队列
- 采用 Cron 定时任务调度
- 采用 HTTP 客户端封装
- 采用全局事件总线
- 内置文件上传与静态资源托管
- 内置 SVG 图形验证码

### 🔐 安全体系

- 采用 CSRF 防护设计
- 采用双 Token 认证设计
- 采用端到端加解密设计
- 采用 Helmet 安全响应头
- 内置防重放攻击防护
- 内置接口限流防护

### 🛠️ 工程化

- 采用 Vite + SWC 驱动编译构建
- 采用 ESLint + Prettier 代码规范化
- 采用 Husky + lint-staged 自动化检查
- 全量 TypeScript，完整类型推导
- 采用 `.env` 统一环境变量管理

---

## 🗂️ 项目结构

```md
nest-server-template
├── prisma/
│   ├── migrations/          # 数据库迁移文件
│   └── schema.prisma        # 数据模型定义
├── src/
│   ├── constants/           # 常量模块
│   ├── decorators/          # 装饰器模块
│   ├── dtos/                # DTO 模块
│   ├── exception-filters/   # 异常过滤器模块
│   ├── exceptions/          # 异常类模块
│   ├── guards/              # 守卫模块
│   ├── interceptors/        # 拦截器模块
│   ├── middlewares/         # 中间件模块
│   ├── modules/
│   │   ├── auth/            # 认证模块
│   │   ├── core/            # 核心模块
│   │   ├── shared/          # 共享模块
│   │   └── system/          # 系统模块
│   ├── pipes/               # 管道模块
│   ├── types/               # 类型模块
│   ├── utils/               # 工具函数模块
│   ├── app.module.ts        # App 模块
│   └── main.ts              # 应用入口文件
├── .env                     # 环境变量配置
└── prisma.config.ts         # Prisma 配置
```

---

## 🔧 环境要求

| 工具 | 版本要求 |
| ------ | -------- |
| Node.js | `>= 22.0.0` |
| pnpm | `>= 8.15.5 < 10.0.0` |
| PostgreSQL | `>= 16` |
| Redis | `>= 7` |

---

## 🚀 快速上手

### 1. 准备开发环境

**PostgreSQL**

下载并安装 PostgreSQL，启动数据库服务，推荐使用 Navicat Premium 作为数据库可视化管理工具。

**Redis**

下载并安装 Redis，启动 Redis 服务，推荐使用 Redis Insight 作为 Redis 可视化管理工具。

**Postman**

推荐使用 Postman 进行接口调试。

### 2. 配置环境变量

修改项目根目录下的 `.env` 文件，替换以下内容：

- 将所有密钥（CSRF、JWT、RSA、AES、HMAC）替换为自己的密钥，不要使用模板中的默认值
- 将 `VITE_DATABASE_URL` 和 `VITE_CACHE_URL` 替换为本地实际的数据库与 Redis 连接信息

### 3. 安装依赖

```bash
pnpm install
```

### 4. 数据库迁移

```bash
pnpm prisma:dev
```

### 5. 启动开发服务

```bash
pnpm dev
```

### 6. 访问服务

服务默认运行在 `http://localhost:3000/api`

---

## 🛠️ 常用命令

```bash
# 开发启动
pnpm dev

# 生产构建
pnpm build

# 生产启动
pnpm start

# 版本升级 & Git提交
pnpm release

# Prisma 开发迁移
pnpm prisma:dev

# Prisma 生产迁移
pnpm prisma:deploy

# 打开 Prisma Studio
pnpm prisma:studio
```

---

## 📝 待办事项

### 系统模块

- [ ] 部门管理模块（`DeptModule`）
- [ ] 角色管理模块（`RoleModule`）
- [ ] 菜单管理模块（`MenuModule`）
- [ ] 岗位管理模块（`PostModule`）
- [ ] 通知公告模块（`NoticeModule`）
- [ ] 字典管理模块（`DictModule`）
- [ ] 参数配置模块（`ConfigModule`）
- [ ] 定时任务模块（`JobModule`）

### 监控模块

- [ ] 服务监控模块（CPU、内存、服务器、磁盘信息）
- [ ] 缓存监控模块（Redis 服务信息）
- [ ] 缓存管理模块（缓存列表查看与缓存项操作）
- [ ] 健康检查模块（数据库、Redis 等服务健康状态检测）

---

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request 参与贡献！

---

## 📄 开源协议

本项目基于 [MIT License](./LICENSE) 开源。

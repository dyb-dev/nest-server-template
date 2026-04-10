/*
 * @FileDesc: 初始化种子数据
 */

import { PrismaPg } from "@prisma/adapter-pg"
import { hash } from "bcrypt"
import { Pool } from "pg"

import { PrismaClient, SysMenuType } from "../src/prisma/client"
import { VITE_ENV } from "../vite.config"

import type { Prisma } from "../src/prisma/client"

/** 连接池 */
const pool = new Pool({
    // 连接 URL
    connectionString: VITE_ENV.VITE_DATABASE_URL
})
/** 驱动适配器 */
const adapter = new PrismaPg(pool)
/** Prisma 客户端 */
const prisma = new PrismaClient({ adapter })

/**
 * 初始化种子数据
 *
 * @author dyb-dev
 * @date 2026-04-08 21:36:12
 */
const main = async () => {

    /** 管理员用户名 */
    const ADMIN_USERNAME = "admin"
    /** 系统创建者 */
    const SYSTEM_CREATOR_BY = "system"
    /** 初始密码 */
    const INIT_PASSWORD = "Admin@123456"

    const existing = await prisma.sysUser.findFirst({
        where: { username: ADMIN_USERNAME }
    })

    if (existing) {

        console.warn("\n\x1b[33m种子数据已存在，无需初始化\x1b[0m")
        return

    }

    await prisma.$transaction(async tx => {

        // #region CODE: 部门

        const dept = await tx.sysDept.create({
            data: {
                name: "总公司",
                sort: 1,
                createdBy: SYSTEM_CREATOR_BY
            }
        })

        // #endregion

        // #region CODE: 岗位

        const postCeo = await tx.sysPost.create({
            data: { name: "董事长", code: "ceo", sort: 1, createdBy: SYSTEM_CREATOR_BY }
        })

        // #endregion

        // #region CODE: 菜单

        type TMenuNode = Prisma.SysMenuCreateArgs["data"] & { children?: TMenuNode[] }

        const createMenuTree = async (menus: TMenuNode[], parentId?: number): Promise<number[]> => {

            const ids: number[] = []

            for (const menu of menus) {

                const created = await tx.sysMenu.create({
                    data: {
                        parentId,
                        name: menu.name,
                        type: menu.type,
                        icon: menu.icon,
                        routeName: menu.routeName,
                        path: menu.path,
                        component: menu.component,
                        sort: menu.sort,
                        perms: menu.perms,
                        createdBy: SYSTEM_CREATOR_BY
                    }
                })

                ids.push(created.id)

                if (menu.children?.length) {

                    ids.push(...await createMenuTree(menu.children, created.id))

                }

            }

            return ids

        }

        const allMenuIds = await createMenuTree([
            {
                name: "系统管理",
                type: SysMenuType.Catalog,
                icon: null,
                sort: 1,
                children: [
                    {
                        name: "用户管理",
                        type: SysMenuType.Menu,
                        icon: null,
                        routeName: null,
                        path: null,
                        component: null,
                        sort: 1,
                        perms: "system:user:read",
                        children: [
                            { name: "用户新增", type: SysMenuType.Button, sort: 1, perms: "system:user:create" },
                            { name: "用户修改", type: SysMenuType.Button, sort: 2, perms: "system:user:update" },
                            { name: "重置密码", type: SysMenuType.Button, sort: 3, perms: "system:user:resetPassword" },
                            { name: "用户删除", type: SysMenuType.Button, sort: 4, perms: "system:user:delete" }
                        ]
                    },
                    {
                        name: "角色管理",
                        type: SysMenuType.Menu,
                        icon: null,
                        routeName: null,
                        path: null,
                        component: null,
                        sort: 2,
                        perms: "system:role:read",
                        children: [
                            { name: "角色新增", type: SysMenuType.Button, sort: 1, perms: "system:role:create" },
                            { name: "角色修改", type: SysMenuType.Button, sort: 2, perms: "system:role:update" },
                            { name: "角色删除", type: SysMenuType.Button, sort: 3, perms: "system:role:delete" }
                        ]
                    },
                    {
                        name: "菜单管理",
                        type: SysMenuType.Menu,
                        icon: null,
                        routeName: null,
                        path: null,
                        component: null,
                        sort: 3,
                        perms: "system:menu:read",
                        children: [
                            { name: "菜单新增", type: SysMenuType.Button, sort: 1, perms: "system:menu:create" },
                            { name: "菜单修改", type: SysMenuType.Button, sort: 2, perms: "system:menu:update" },
                            { name: "菜单删除", type: SysMenuType.Button, sort: 3, perms: "system:menu:delete" }
                        ]
                    },
                    {
                        name: "部门管理",
                        type: SysMenuType.Menu,
                        icon: null,
                        routeName: null,
                        path: null,
                        component: null,
                        sort: 4,
                        perms: "system:dept:read",
                        children: [
                            { name: "部门新增", type: SysMenuType.Button, sort: 1, perms: "system:dept:create" },
                            { name: "部门修改", type: SysMenuType.Button, sort: 2, perms: "system:dept:update" },
                            { name: "部门删除", type: SysMenuType.Button, sort: 3, perms: "system:dept:delete" }
                        ]
                    },
                    {
                        name: "岗位管理",
                        type: SysMenuType.Menu,
                        icon: null,
                        routeName: null,
                        path: null,
                        component: null,
                        sort: 5,
                        perms: "system:post:read",
                        children: [
                            { name: "岗位新增", type: SysMenuType.Button, sort: 1, perms: "system:post:create" },
                            { name: "岗位修改", type: SysMenuType.Button, sort: 2, perms: "system:post:update" },
                            { name: "岗位删除", type: SysMenuType.Button, sort: 3, perms: "system:post:delete" }
                        ]
                    },
                    {
                        name: "字典管理",
                        type: SysMenuType.Menu,
                        icon: null,
                        routeName: null,
                        path: null,
                        component: null,
                        sort: 6,
                        perms: "system:dict:read",
                        children: [
                            { name: "字典新增", type: SysMenuType.Button, sort: 1, perms: "system:dict:create" },
                            { name: "字典修改", type: SysMenuType.Button, sort: 2, perms: "system:dict:update" },
                            { name: "字典删除", type: SysMenuType.Button, sort: 3, perms: "system:dict:delete" }
                        ]
                    },
                    {
                        name: "参数设置",
                        type: SysMenuType.Menu,
                        icon: null,
                        routeName: null,
                        path: null,
                        component: null,
                        sort: 7,
                        perms: "system:config:read",
                        children: [
                            { name: "参数新增", type: SysMenuType.Button, sort: 1, perms: "system:config:create" },
                            { name: "参数修改", type: SysMenuType.Button, sort: 2, perms: "system:config:update" },
                            { name: "参数删除", type: SysMenuType.Button, sort: 3, perms: "system:config:delete" }
                        ]
                    },
                    {
                        name: "通知公告",
                        type: SysMenuType.Menu,
                        icon: null,
                        routeName: null,
                        path: null,
                        component: null,
                        sort: 8,
                        perms: "system:notice:read",
                        children: [
                            { name: "公告新增", type: SysMenuType.Button, sort: 1, perms: "system:notice:create" },
                            { name: "公告修改", type: SysMenuType.Button, sort: 2, perms: "system:notice:update" },
                            { name: "公告删除", type: SysMenuType.Button, sort: 3, perms: "system:notice:delete" }
                        ]
                    },
                    {
                        name: "日志管理",
                        type: SysMenuType.Catalog,
                        icon: null,
                        sort: 9,
                        children: [
                            {
                                name: "操作日志",
                                type: SysMenuType.Menu,
                                icon: null,
                                routeName: null,
                                path: null,
                                component: null,
                                sort: 1,
                                perms: "system:operationLog:read",
                                children: [
                                    {
                                        name: "操作日志删除",
                                        type: SysMenuType.Button,
                                        sort: 1,
                                        perms: "system:operationLog:delete"
                                    }
                                ]
                            },
                            {
                                name: "登录日志",
                                type: SysMenuType.Menu,
                                icon: null,
                                routeName: null,
                                path: null,
                                component: null,
                                sort: 2,
                                perms: "system:loginLog:read",
                                children: [
                                    {
                                        name: "登录日志删除",
                                        type: SysMenuType.Button,
                                        sort: 1,
                                        perms: "system:loginLog:delete"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: "系统监控",
                type: SysMenuType.Catalog,
                icon: null,
                sort: 2,
                children: [
                    {
                        name: "在线用户",
                        type: SysMenuType.Menu,
                        icon: null,
                        routeName: null,
                        path: null,
                        component: null,
                        sort: 1,
                        perms: "system:loginSession:read",
                        children: [{ name: "强制登出", type: SysMenuType.Button, sort: 1, perms: "system:loginSession:delete" }]
                    },
                    {
                        name: "服务监控",
                        type: SysMenuType.Menu,
                        icon: null,
                        routeName: null,
                        path: null,
                        component: null,
                        sort: 2,
                        perms: "system:server:read"
                    },
                    {
                        name: "缓存监控",
                        type: SysMenuType.Menu,
                        icon: null,
                        routeName: null,
                        path: null,
                        component: null,
                        sort: 3,
                        perms: "system:cache:read"
                    },
                    {
                        name: "缓存列表",
                        type: SysMenuType.Menu,
                        icon: null,
                        routeName: null,
                        path: null,
                        component: null,
                        sort: 4,
                        perms: "system:cache:read",
                        children: [{ name: "缓存删除", type: SysMenuType.Button, sort: 1, perms: "system:cache:delete" }]
                    },
                    {
                        name: "定时任务",
                        type: SysMenuType.Menu,
                        icon: null,
                        routeName: null,
                        path: null,
                        component: null,
                        sort: 5,
                        perms: "system:job:read",
                        children: [
                            { name: "任务新增", type: SysMenuType.Button, sort: 1, perms: "system:job:create" },
                            { name: "任务修改", type: SysMenuType.Button, sort: 2, perms: "system:job:update" },
                            { name: "任务删除", type: SysMenuType.Button, sort: 3, perms: "system:job:delete" },
                            { name: "执行任务", type: SysMenuType.Button, sort: 4, perms: "system:job:run" }
                        ]
                    }
                ]
            }
        ])

        // #endregion

        // #region CODE: 角色

        const roleAdmin = await tx.sysRole.create({
            data: {
                name: "超级管理员",
                code: "admin",
                sort: 1,
                createdBy: SYSTEM_CREATOR_BY
            }
        })

        // #endregion

        // #region CODE: 参数配置

        await tx.sysConfig.createMany({
            data: [
                {
                    name: "账号自助-是否开启用户注册功能",
                    key: "sys.account.register",
                    value: "false",
                    isSystem: true,
                    createdBy: SYSTEM_CREATOR_BY
                },
                {
                    name: "用户管理-账号初始密码",
                    key: "sys.user.initPassword",
                    value: INIT_PASSWORD,
                    isSystem: true,
                    createdBy: SYSTEM_CREATOR_BY
                }
            ]
        })

        // #endregion

        // #region CODE: 定时任务

        await tx.sysJob.createMany({
            data: [
                {
                    name: "登录日志清理",
                    invokeTarget: "login-log:cleanup",
                    cronExpression: "0 0 2 * * *",
                    isSystem: true,
                    createdBy: SYSTEM_CREATOR_BY,
                    remark: "每天凌晨 2 点清理 30 天前的登录日志"
                },
                {
                    name: "登录会话清理",
                    invokeTarget: "login-session:cleanup",
                    cronExpression: "0 0 2 * * *",
                    isSystem: true,
                    createdBy: SYSTEM_CREATOR_BY,
                    remark: "每天凌晨 2 点清理已过期的登录会话"
                },
                {
                    name: "操作日志清理",
                    invokeTarget: "operation-log:cleanup",
                    cronExpression: "0 0 2 * * *",
                    isSystem: true,
                    createdBy: SYSTEM_CREATOR_BY,
                    remark: "每天凌晨 2 点清理 90 天前的操作日志"
                },
                {
                    name: "定时任务日志清理",
                    invokeTarget: "job-log:cleanup",
                    cronExpression: "0 0 2 * * *",
                    isSystem: true,
                    createdBy: SYSTEM_CREATOR_BY,
                    remark: "每天凌晨 2 点清理 30 天前的定时任务日志"
                }
            ]
        })

        // #endregion

        // #region CODE: 用户

        const user = await tx.sysUser.create({
            data: {
                username: ADMIN_USERNAME,
                nickname: "管理员",
                password: await hash(INIT_PASSWORD, 10),
                deptId: dept.id,
                isSystem: true,
                createdBy: SYSTEM_CREATOR_BY
            }
        })

        // #endregion

        // #region CODE: 用户角色关系

        await tx.sysUserRole.create({
            data: { userId: user.id, roleId: roleAdmin.id }
        })

        // #endregion

        // #region CODE: 用户岗位关系

        await tx.sysUserPost.create({
            data: { userId: user.id, postId: postCeo.id }
        })

        // #endregion

        // #region CODE: 角色菜单关系

        await tx.sysRoleMenu.createMany({
            data: allMenuIds.map(menuId => ({ roleId: roleAdmin.id, menuId }))
        })

        // #endregion

    })

}

main()
    .then(async () => {

        await prisma.$disconnect()
        await pool.end()

    })
    .catch(async error => {

        console.error("\n\x1b[31m初始化种子数据失败: \x1b[0m", error)
        await prisma.$disconnect()
        await pool.end()
        process.exit(1)

    })

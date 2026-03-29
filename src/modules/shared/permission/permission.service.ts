/*
 * @FileDesc: 权限服务
 */

import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"

import { MenuService } from "../../system"

import type { Cache } from "@nestjs/cache-manager"

/** 权限服务 */
@Injectable()
export class PermissionService {

    /** 缓存管理器 */
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache

    /** 菜单服务 */
    @Inject(MenuService)
    private readonly menuService: MenuService

    /**
     * 根据用户ID获取权限标识集合（带缓存）
     *
     * @param {number} userId 用户ID
     * @returns {Promise<string[]>} 权限标识数组
     */
    public async getPermsByUserId (userId: number): Promise<string[]> {

        const cacheKey = this.getCacheKey(userId)
        const cached = await this.cacheManager.get<string[]>(cacheKey)

        if (cached) {

            return cached

        }

        const perms = await this.menuService.findPermsByUserId(userId)
        await this.cacheManager.set(cacheKey, perms, 5 * 60 * 1000)

        return perms

    }

    /**
     * 获取缓存 Key
     *
     * @param {number} userId 用户ID
     * @returns {string} 缓存 Key
     */
    private getCacheKey (userId: number): string {

        return `permission:${userId}`

    }

}

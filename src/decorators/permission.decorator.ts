/*
 * @FileDesc: 权限装饰器
 */

import { SetMetadata } from "@nestjs/common"

import type { CustomDecorator } from "@nestjs/common"

/** 权限装饰器 Key */
export const PERMISSION_KEY = Symbol("Permission")

/**
 * 权限装饰器
 *
 * @param {string} perms 权限标识
 * @returns {CustomDecorator<typeof PERMISSION_KEY>} 可用于方法和类上的装饰器
 */
export const Permission = (perms: string): CustomDecorator<typeof PERMISSION_KEY> => SetMetadata(PERMISSION_KEY, perms)

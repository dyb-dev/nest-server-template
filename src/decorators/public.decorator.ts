/*
 * @FileDesc: 公开访问装饰器
 */

import { SetMetadata } from "@nestjs/common"

import type { CustomDecorator } from "@nestjs/common"

/** 公开访问装饰器 Key */
export const PUBLIC_KEY = Symbol("Public")

/**
 * 公开访问装饰器
 *
 * @returns {CustomDecorator<typeof PUBLIC_KEY>} 可用于方法和类上的装饰器
 */
export const Public = (): CustomDecorator<typeof PUBLIC_KEY> => SetMetadata(PUBLIC_KEY, true)

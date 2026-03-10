/*
 * @FileDesc: 加解密装饰器
 */

import { SetMetadata } from "@nestjs/common"

import type { CustomDecorator } from "@nestjs/common"

/** 加解密装饰器 Key */
export const CRYPTO_KEY = Symbol("Crypto")

/**
 * 加解密装饰器
 *
 * @returns {CustomDecorator<typeof CRYPTO_KEY>} 可用于方法和类上的装饰器
 */
export const Crypto = (): CustomDecorator<typeof CRYPTO_KEY> => SetMetadata(CRYPTO_KEY, true)

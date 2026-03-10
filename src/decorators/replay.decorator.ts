/*
 * @FileDesc: 防重放装饰器
 */

import { SetMetadata } from "@nestjs/common"

import type { CustomDecorator } from "@nestjs/common"

/** 防重放装饰器 Key */
export const REPLAY_KEY = Symbol("Replay")

/**
 * 防重放装饰器
 *
 * @returns {CustomDecorator<typeof REPLAY_KEY>} 可用于方法和类上的装饰器
 */
export const Replay = (): CustomDecorator<typeof REPLAY_KEY> => SetMetadata(REPLAY_KEY, true)

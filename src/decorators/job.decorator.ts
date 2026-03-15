/*
 * @FileDesc: 定时任务装饰器
 */

import { SetMetadata } from "@nestjs/common"

import type { CustomDecorator } from "@nestjs/common"

/** 定时任务装饰器 Key */
export const JOB_KEY = Symbol("Job")

/**
 * 定时任务装饰器
 *
 * @param {string} key 任务唯一标识
 * @returns {CustomDecorator<typeof JOB_KEY>} 可用于方法上的装饰器
 */
export const Job = (key: string): CustomDecorator<typeof JOB_KEY> => SetMetadata(JOB_KEY, key)

/*
 * @FileDesc: 表单工具函数
 */

/** 导出 身份证工具函数 */
export * from "./identityCard"

/**
 * FUN: 是否为手机号
 *
 * @author dyb-dev
 * @date 2025-03-08 13:23:06
 * @param {string} phone 手机号
 * @returns {*}  {boolean} 是否为手机号
 */
export const isPhoneNumber = (phone: string): boolean => /^1[3456789]\d{9}$/.test(phone)

/**
 * FUN: 是否为邮箱
 *
 * @author dyb-dev
 * @date 2025-03-08 13:23:28
 * @param {string} email 邮箱
 * @returns {*}  {boolean} 是否为邮箱
 */
export const isEmail = (email: string): boolean => /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)

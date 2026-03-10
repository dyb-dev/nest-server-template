/*
 * @FileDesc: URL 工具函数
 */

import queryString from "query-string"

/**
 * FUN: 获取基础 URL（去除查询参数）
 *
 * @author dyb-dev
 * @date 2023-07-14 15:16:25
 * @param {string} url 完整的 URL 字符串
 * @returns {*}  {string} 去除查询参数后的基础 URL
 */
export const getBaseUrl = (url: string): string => queryString.parseUrl(url).url

/**
 * FUN: 获取 url 的 查询参数对象
 *
 * @author dyb-dev
 * @date 2023-07-14 16:18:55
 * @param {string} url 需要解析的 URL
 * @returns {*}  {queryString.ParsedQuery<string>} query 对象
 */
export const getUrlQuery = (url: string): queryString.ParsedQuery<string> => queryString.parseUrl(url).query

/**
 * FUN: 根据 key 从 url 的 查询参数对象 中获取单个参数值
 *
 * @author dyb-dev
 * @date 2023-07-08 17:32:46
 * @param {string} url 需要解析的 URL
 * @param {string} key query 的 key
 * @returns {*}  {string} query 的 value
 */
export const getUrlQueryValue = (url: string, key: string): string => (getUrlQuery(url)[key] as string) || ""

/**
 * FUN: 设置或更新 从 url 的 查询参数对象 中的指定参数，并返回更新后的 URL 字符串
 *
 * @author dyb-dev
 * @date 2023-07-08 18:12:40
 * @param {string} url 需要解析的 URL
 * @param {string} key 需要 设置或更新 参数 的 key
 * @param {string} value 需要 设置或更新 参数 的 value
 * @param {queryString.StringifyOptions} [options] stringifyUrl 的 options
 * @returns {*}  {string} 设置或更新后的 url
 */
export const setUrlQueryValue = (url: string, key: string, value: string, options?: queryString.StringifyOptions): string => {

    const _query = getUrlQuery(url)

    _query[key] = value

    return queryString.stringifyUrl({ url: url, query: _query }, options)

}

/**
 * FUN: 合并 URL 的查询参数，并返回更新后的 URL 字符串
 *
 * @author dyb-dev
 * @date 2023-07-08 19:42:41
 * @param {string} url 完整的 URL 字符串
 * @param {queryString.ParsedQuery<string>} obj 需要合并到 URL 中的查询参数对象
 * @param {queryString.StringifyOptions} [options] stringifyUrl 的 options
 * @returns {*}  {string} 更新后的 URL 字符串
 */
export const mergeUrlQuery = (
    url: string,
    obj: queryString.ParsedQuery<string>,
    options?: queryString.StringifyOptions
): string => {

    const _query = getUrlQuery(url)

    Object.assign(_query, obj)

    return queryString.stringifyUrl({ url: url, query: _query }, options)

}

/**
 * FUN: 判断路径是否为绝对路径
 * - 匹配以 `协议` | `域名` | `端口号` 开头的路径
 *
 * @author dyb-dev
 * @date 2023-07-09 14:52:41
 * @param {string} path 路径
 * @returns {*}  {boolean} 是否为绝对路径
 */
export const isAbsoluteUrl = (path: string): boolean => /^(https?:\/\/|:\/\/|[a-zA-Z0-9.-]+:\d+|:\d+)/.test(path)

/** 相对路径转换为绝对路径的选项 */
export interface IToAbsoluteUrlOptions {
    /** 相对 URL 路径 */
    relativePath: string
    /** 网址的协议、域名、端口号组成的字符串 */
    urlOrigin?: string
    /** 基础路径 */
    basePath?: string
}

/**
 * FUN: 将相对 Url 路径转换为绝对 Url 路径
 *
 * @author dyb-dev
 * @date 2023-07-09 15:52:41
 * @param {IToAbsoluteUrlOptions} options 选项
 * @returns {*}  {string} 绝对路径
 */
export const toAbsoluteUrl = (options: IToAbsoluteUrlOptions): string => {

    const { relativePath, urlOrigin = "", basePath = "" } = options

    if (!relativePath || typeof relativePath !== "string" || isAbsoluteUrl(relativePath)) {

        console.error("toAbsoluteUrl() relativePath:", relativePath)
        return relativePath

    }

    const _urlOrigin = trimUrlSlashes(urlOrigin)
    const _basePath = trimUrlSlashes(basePath)
    const _relativePath = trimUrlSlashes(relativePath)

    let _url = [_urlOrigin, _basePath, _relativePath].filter(Boolean).join("/")

    if (!isAbsoluteUrl(_url)) {

        _url = `/${_url}`

    }

    return _url

}

/**
 * FUN: 根据选项移除 URL 的首尾斜杠
 *
 * @author dyb-dev
 * @date 2023-07-09 16:55:41
 * @param {string} url 需要处理的 URL
 * @param {{ trimStart?: boolean; trimEnd?: boolean }} [options={}] 配置项
 * @param {boolean} [options.trimStart=true] 是否移除开头的斜杠
 * @param {boolean} [options.trimEnd=true] 是否移除结尾的斜杠
 * @returns {*}  {string} 处理后的 URL
 */
export const trimUrlSlashes = (url: string, options: { trimStart?: boolean; trimEnd?: boolean } = {}): string => {

    const { trimStart = true, trimEnd = true } = options

    let _url = url
    if (trimStart) {

        _url = _url.replace(/^\//, "")

    }
    if (trimEnd) {

        _url = _url.replace(/\/$/, "")

    }
    return _url

}

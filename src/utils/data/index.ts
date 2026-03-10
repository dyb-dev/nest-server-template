/*
 * @FileDesc: 数据处理工具函数
 */

import { cloneDeep, isPlainObject } from "es-toolkit"

/** 替换字段名 选项 */
export interface IReplaceFieldNamesOptions<
    Data extends Record<PropertyKey, any>,
    MaxDepth extends number = number,
    Keys extends TKeys<Data, MaxDepth> = TKeys<Data, MaxDepth>
> {
    /**
     * 目标数据
     * - 支持 `对象 | 数组`
     */
    data: Data | Data[]
    /**
     * 字段映射规则
     * - `[新字段]: 原字段 | 函数`
     */
    fieldMap: Record<Keys | PropertyKey, Keys | ((key: Keys) => boolean)>
    /**
     * 最小递归深度
     *
     * @default 1
     */
    minDepth?: number
    /**
     * 最大递归深度
     *
     * @default Infinity
     */
    maxDepth?: MaxDepth
    /**
     * 是否替换后删除原字段
     *
     * @default false
     */
    removeOriginalField?: boolean
    /**
     * 是否新字段在原对象中存在时才替换
     *
     * @default false
     */
    onlyReplaceIfNewFieldExists?: boolean
    /**
     * 是否使用原字段的最新数据进行替换
     *
     * 示例：
     * ```ts
     * const test = {
     * a: 1,
     * b: 2
     * };
     *
     * // 场景 1：字段相互依赖（需使用最新值）
     * fieldMap: { b: 'a' }  // b 的值来自 a 的当前值
     * useUpdatedValueForReplacement: true
     *
     * // 场景 2：字段相互独立（需使用原始值）
     * fieldMap: { b: 'a', a: 'b' }  // a 与 b 互换，需使用原始未被修改的值
     * useUpdatedValueForReplacement: false
     * removeOriginalField: false
     * ```
     *
     * @default false
     */
    useUpdatedValueForReplacement?: boolean
}

/**
 * FUN: 替换字段名
 * - 支持对象、数组，并返回新的引用
 *
 * @author dyb-dev
 * @date 2025-06-08 13:15:45
 * @param options - 替换字段名的配置项
 * @param options.data - 目标数据，支持对象或数组
 * @param options.fieldMap - 字段映射规则，格式为 `[新字段]: 原字段 | 函数`
 * @param options.minDepth - 最小递归深度
 * @param options.maxDepth - 最大递归深度
 * @param options.removeOriginalField - 是否替换后删除原字段
 * @param options.onlyReplaceIfNewFieldExists - 是否仅在新字段已存在时才替换
 * @param options.useUpdatedValueForReplacement - 是否使用已更新字段的值进行替换
 * @returns {Result} 替换后的新对象或数组（新引用）
 */
export const replaceFieldNames = <
    Data extends Record<PropertyKey, any>,
    Result extends Record<PropertyKey, any> | Record<PropertyKey, any>[],
    MaxDepth extends number = number,
    Keys extends TKeys<Data, MaxDepth> = TKeys<Data, MaxDepth>
>({
        data,
        fieldMap,
        removeOriginalField = false,
        useUpdatedValueForReplacement = false,
        onlyReplaceIfNewFieldExists = false,
        minDepth = 1,
        maxDepth = Infinity as MaxDepth
    }: IReplaceFieldNamesOptions<Data, MaxDepth, Keys>): Result => {

    /** 最初传入的数据副本，作为替换时的参考源 */
    const _originData = cloneDeep(data)
    /** 最终输出的数据副本，作为递归替换处理目标 */
    const _resultData = cloneDeep(_originData)

    /** 字段映射的所有键集合 */
    const _fieldMapKeyList = Object.keys(fieldMap)
    // 获取所有匹配的字段映射键集合
    const _getMatchedMapKeyList = (key: Keys) => {

        return _fieldMapKeyList.filter(fieldMapKey => {

            const _fieldMapKeyValue = fieldMap[fieldMapKey]
            if (typeof _fieldMapKeyValue === "function") {

                const _func = _fieldMapKeyValue as (key: Keys) => boolean
                return _func(key)

            }
            return _fieldMapKeyValue === key

        })

    }

    // 递归处理字段替换函数
    const _replaceFieldNames = (currentData: any, originData: any, currentDepth: number = 1): any => {

        // 当前递归深度 <= 最大递归深度
        if (currentDepth <= maxDepth) {

            // 当前数据是数组，递归处理每个数组项
            if (Array.isArray(currentData)) {

                return currentData.map((item, index) => _replaceFieldNames(item, originData[index], currentDepth + 1))

            }

            // 当前数据是对象，递归处理每个字段
            if (isPlainObject(currentData)) {

                const _currentDataKeyList = Object.keys(currentData)

                // 先递归处理内部嵌套结构
                _currentDataKeyList.forEach(key => {

                    currentData[key] = _replaceFieldNames(currentData[key], originData[key], currentDepth + 1)

                })

                // 当前递归深度 >= 最小递归深度
                if (currentDepth >= minDepth) {

                    // 执行替换逻辑
                    _currentDataKeyList.forEach(key => {

                        // 获取所有匹配的字段映射键
                        const _matchedMapKeyList = _getMatchedMapKeyList(key as Keys)

                        if (!_matchedMapKeyList.length) {

                            return

                        }

                        // 对每一个匹配到的字段映射进行处理
                        _matchedMapKeyList.forEach(newKey => {

                            // 是否新字段在原对象中存在时才替换
                            if (!onlyReplaceIfNewFieldExists || newKey in currentData) {

                                // 是否使用 最新数据 | 原始数据 进行替换
                                currentData[newKey] = useUpdatedValueForReplacement ? currentData[key] : originData[key]

                            }

                        })

                        // 是否删除原字段
                        if (removeOriginalField) {

                            delete currentData[key]

                        }

                    })

                }

            }

        }

        return currentData

    }

    return _replaceFieldNames(_resultData, _originData)

}

/**
 * FUN: 根据分隔符分割字符串
 *
 * @author dyb-dev
 * @date 2025-08-08 14:20:26
 * @param {string} str 需要分割的字符串
 * @param {string} delimiter 分隔符
 * @returns {*}  {string[]} 结果数组
 */
export const splitStringByDelimiter = (str: string, delimiter: string): string[] => {

    return delimiter ? str.split(new RegExp(`(?<=${delimiter})|(?=${delimiter})`, "g")) : [str]

}

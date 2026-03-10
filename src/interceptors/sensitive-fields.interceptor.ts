/*
 * @FileDesc: 敏感字段拦截器
 */

import { Injectable, StreamableFile } from "@nestjs/common"
import { isPlainObject, omit, mapValues } from "es-toolkit"
import { map } from "rxjs"

import type { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common"
import type { Observable } from "rxjs"

/** 敏感字段拦截器 */
@Injectable()
export class SensitiveFieldsInterceptor implements NestInterceptor {

    public intercept (_: ExecutionContext, next: CallHandler): Observable<StreamableFile | unknown> {

        return next.handle().pipe(
            map((data: StreamableFile | unknown) => {

                return data instanceof StreamableFile ? data : this.filterSensitiveFields(data)

            })
        )

    }

    /**
     * 递归过滤敏感字段
     *
     * @param {unknown} data 原始数据
     * @param {Set<string>} sensitiveFields 敏感字段集合
     * @returns {unknown} 过滤后的数据
     */
    private filterSensitiveFields (data: unknown, sensitiveFields: Set<string> = new Set(["password"])): unknown {

        if (Array.isArray(data)) {

            return data.map(item => this.filterSensitiveFields(item, sensitiveFields))

        }

        if (isPlainObject(data)) {

            const filtered = omit(data, [...sensitiveFields])
            return mapValues(filtered, value => this.filterSensitiveFields(value, sensitiveFields))

        }

        return data

    }

}

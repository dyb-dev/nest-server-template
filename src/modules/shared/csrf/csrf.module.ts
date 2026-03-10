/*
 * @FileDesc: CSRF 模块
 */

import { Module } from "@nestjs/common"

import { CsrfService } from "./csrf.service"

/** CSRF 模块 */
@Module({
    providers: [CsrfService],
    exports: [CsrfService]
})
export class CsrfModule {}

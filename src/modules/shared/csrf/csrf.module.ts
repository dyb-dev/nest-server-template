/*
 * @FileDesc: CSRF 模块
 */

import { forwardRef, Module } from "@nestjs/common"

import { AuthModule } from "../../auth"

import { CsrfService } from "./csrf.service"

/** CSRF 模块 */
@Module({
    imports: [forwardRef(() => AuthModule)],
    providers: [CsrfService],
    exports: [CsrfService]
})
export class CsrfModule {}

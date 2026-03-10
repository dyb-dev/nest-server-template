/*
 * @FileDesc: UserAgent 模块
 */

import { Module } from "@nestjs/common"

import { UserAgentService } from "./user-agent.service"

/** UserAgent 模块 */
@Module({
    providers: [UserAgentService],
    exports: [UserAgentService]
})
export class UserAgentModule {}

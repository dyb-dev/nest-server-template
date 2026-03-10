/*
 * @FileDesc: 共享模块
 */

import { Module } from "@nestjs/common"

import { CaptchaModule } from "./captcha"
import { CryptoModule } from "./crypto"
import { CsrfModule } from "./csrf"
import { FileModule } from "./file"
import { LocationModule } from "./location"
import { ReplayModule } from "./replay"
import { UserAgentModule } from "./user-agent"

/** 共享模块 */
@Module({
    imports: [CaptchaModule, CryptoModule, CsrfModule, FileModule, LocationModule, ReplayModule, UserAgentModule],
    exports: [CaptchaModule, CryptoModule, CsrfModule, FileModule, LocationModule, ReplayModule, UserAgentModule]
})
export class SharedModule {}

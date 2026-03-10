/*
 * @FileDesc: Demo 模块
 */

import { BullModule } from "@nestjs/bullmq"
import { Module } from "@nestjs/common"

import { DemoController } from "./demo.controller"
import { ConfigurableModuleClass } from "./demo.module-definition"
import { DEMO_QUEUE, DemoProcessor } from "./demo.processor"
import { DemoService } from "./demo.service"

/** Demo 模块 */
@Module({
    imports: [BullModule.registerQueue({ name: DEMO_QUEUE })],
    controllers: [DemoController],
    providers: [DemoProcessor, DemoService]
})
export class DemoModule extends ConfigurableModuleClass {}

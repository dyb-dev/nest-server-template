/*
 * @FileDesc: Demo 模块定义
 */

import { ConfigurableModuleBuilder } from "@nestjs/common"

/** Demo 模块选项 */
export interface DemoModuleOptions {
    /** 描述 */
    desc: string
}

// 构建可配置模块类和选项令牌
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<DemoModuleOptions>()
    .setClassMethodName("forRoot")
    .setExtras(
        {
            global: false
        },
        (definition, extras) => ({
            ...definition,
            global: extras.global
        })
    )
    .build()

// /*
//  * @FileDesc: 检查权限策略装饰器
//  */

// import { SetMetadata } from "@nestjs/common"

// import type { AppAbility } from "@/modules"

// export const CHECK_POLICIES_KEY = Symbol("checkPolicies")

// /**
//  * 策略处理器回调函数类型
//  * 可以直接使用函数作为策略
//  */
// export type PolicyHandlerCallback = (ability: AppAbility) => boolean

// export const CheckPolicies = (...handlers: PolicyHandlerCallback[]) => SetMetadata(CHECK_POLICIES_KEY, handlers)

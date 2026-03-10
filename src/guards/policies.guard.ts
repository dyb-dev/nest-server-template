// /*
//  * @FileDesc: 权限守卫
//  */

// import { Injectable, ForbiddenException, Inject } from "@nestjs/common"
// import { Reflector } from "@nestjs/core"

// import { CHECK_POLICIES_KEY } from "@/decorators"
// import { CaslService } from "@/modules"

// import type { PolicyHandlerCallback } from "@/decorators"
// import type { CanActivate, ExecutionContext } from "@nestjs/common"
// import type { Request } from "express"

// /** 权限守卫 */
// @Injectable()
// export class PoliciesGuard implements CanActivate {

//     /** 反射器 */
//     @Inject(Reflector)
//     private readonly reflector: Reflector

//     /** CASL 服务 */
//     @Inject(CaslService)
//     private readonly caslService: CaslService

//     public async canActivate (context: ExecutionContext): Promise<boolean> {

//         // 1. 获取路由处理器上的策略处理器
//         const policyHandlers =
//             this.reflector.getAllAndOverride<PolicyHandlerCallback[]>(CHECK_POLICIES_KEY, [
//                 context.getHandler(),
//                 context.getClass()
//             ]) || []

//         // 2. 如果没有定义策略，默认允许访问
//         if (!policyHandlers.length) {

//             return true

//         }

//         // 3. 从请求中获取用户信息
//         const request = context.switchToHttp().getRequest<Request>()
//         // @ts-ignore
//         const user = request.user

//         // 4. 如果没有用户信息，拒绝访问
//         if (!user) {

//             throw new ForbiddenException("用户未认证")

//         }

//         // 5. 为当前用户创建权限能力对象
//         const ability = this.caslService.create(user)

//         // 6. 检查是否所有策略都通过
//         const isAllowed = policyHandlers.every(handler => handler(ability))

//         // 7. 如果权限检查失败，抛出异常
//         if (!isAllowed) {

//             throw new ForbiddenException("权限不足")

//         }

//         return true

//     }

// }

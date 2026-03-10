// /*
//  * @FileDesc: CASL 服务
//  */

// import { AbilityBuilder, createMongoAbility } from "@casl/ability"
// import { Injectable } from "@nestjs/common"

// import { Role } from "@/modules"

// import type { User } from "@/modules"
// import type { ExtractSubjectType, InferSubjects, MongoAbility } from "@casl/ability"

// /**
//  * 定义系统中所有可以被授权的资源类型
//  * 目前只有 User
//  *
//  * 未来扩展示例：
//  * type Subjects = InferSubjects<typeof User | typeof Article | typeof Post> | 'all';
//  */
// type Subjects = InferSubjects<typeof User> | "all"

// /**
//  * 应用的权限能力类型
//  * 格式：MongoAbility<[操作类型, 资源类型]>
//  */
// export type AppAbility = MongoAbility<[Role, Subjects]>

// /** 权限控制服务 */
// @Injectable()
// export class CaslService {

//     public create (user: User): AppAbility {

//         const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

//         if (user.role === Role.Admin) {

//             can(Role.Admin, "all")

//         }

//         can(Role.User, "all")

//         return build({
//             detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>
//         })

//     }

// }

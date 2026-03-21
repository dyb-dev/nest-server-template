/*
 * @FileDesc: 用户岗位模块
 */

import { Module } from "@nestjs/common"

import { UserPostRepository } from "./user-post.repository"
import { UserPostService } from "./user-post.service"

/** 用户岗位模块 */
@Module({
    providers: [UserPostRepository, UserPostService],
    exports: [UserPostService]
})
export class UserPostModule {}

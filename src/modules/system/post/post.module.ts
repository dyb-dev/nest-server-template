/*
 * @FileDesc: 岗位模块
 */

import { Module } from "@nestjs/common"

import { UserPostModule } from "../user-post"

import { PostController } from "./post.controller"
import { PostRepository } from "./post.repository"
import { PostService } from "./post.service"

/** 岗位模块 */
@Module({
    imports: [UserPostModule],
    controllers: [PostController],
    providers: [PostRepository, PostService],
    exports: [PostService]
})
export class PostModule {}

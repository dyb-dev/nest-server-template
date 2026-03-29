/*
 * @FileDesc: 用户岗位服务
 */

import { Inject, Injectable } from "@nestjs/common"

import { UserPostRepository } from "./user-post.repository"

/** 用户岗位服务 */
@Injectable()
export class UserPostService {

    /** 用户岗位仓储 */
    @Inject(UserPostRepository)
    private readonly userPostRepository: UserPostRepository

    /**
     * 设置用户岗位关联
     *
     * @param {number} userId 用户ID
     * @param {number[]} postIds 岗位ID数组
     * @returns {Promise<void>}
     */
    public async setPostsByUserId (userId: number, postIds: number[]): Promise<void> {

        await this.userPostRepository.deleteMany({ where: { userId } })
        if (postIds.length > 0) {

            await this.userPostRepository.createMany(postIds.map(postId => ({ userId, postId })))

        }

    }

    /**
     * 根据用户ID数组删除所有岗位关联
     *
     * @param {number[]} userIds 用户ID数组
     * @returns {Promise<void>}
     */
    public async deleteByUserIds (userIds: number[]): Promise<void> {

        await this.userPostRepository.deleteMany({ where: { userId: { in: userIds } } })

    }

    /**
     * 根据岗位ID数组校验是否存在用户绑定
     *
     * @param {number[]} postIds 岗位ID数组
     * @returns {Promise<boolean>} 是否存在
     */
    public async existsByPostIds (postIds: number[]): Promise<boolean> {

        const exists = await this.userPostRepository.exists({ postId: { in: postIds } })
        return exists

    }

}

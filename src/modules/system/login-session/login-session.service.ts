/*
 * @FileDesc: 登录会话服务
 */

import { Inject, Injectable } from "@nestjs/common"
import { Transactional } from "@nestjs-cls/transactional"
import { InjectPinoLogger } from "nestjs-pino"

import { Job } from "@/decorators"
import { PaginationResponseDto } from "@/dtos"
import { BusinessLogicException } from "@/exceptions"

import { DatabaseService } from "../../core"
import { CryptoService } from "../../shared"

import { DeleteRequestDto, GetListRequestDto, GetPageListRequestDto } from "./login-session.dto"
import { LoginSessionRepository } from "./login-session.repository"

import type { SysLoginSession, Prisma } from "@/prisma/client"
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma"
import type { PinoLogger } from "nestjs-pino"

/** 登录会话服务 */
@Injectable()
export class LoginSessionService {

    /** 日志记录器 */
    @InjectPinoLogger(LoginSessionService.name)
    private readonly logger: PinoLogger

    /** 登录会话仓储 */
    @Inject(LoginSessionRepository)
    private readonly loginSessionRepository: LoginSessionRepository

    /** 加解密服务 */
    @Inject(CryptoService)
    private readonly cryptoService: CryptoService

    /**
     * 获取登录会话列表
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Promise<SysLoginSession[]>} 会话列表
     */
    public async getList (params: GetListRequestDto): Promise<SysLoginSession[]> {

        this.logger.info("[getList] started")

        const where = this.buildQueryWhere(params)
        const data = await this.loginSessionRepository.findMany({ where })

        this.logger.info("[getList] completed")
        return data

    }

    /**
     * 获取分页登录会话列表
     *
     * @param {GetPageListRequestDto} params 查询参数
     * @returns {Promise<PaginationResponseDto<SysLoginSession>>} 会话列表和总数
     */
    public async getPageList (params: GetPageListRequestDto): Promise<PaginationResponseDto<SysLoginSession>> {

        this.logger.info("[getPageList] started")

        const { page, pageSize, ...restParams } = params

        const where = this.buildQueryWhere(restParams)
        const skip = (page - 1) * pageSize
        const take = pageSize

        const data = await this.loginSessionRepository.findManyByPage(skip, take, { where })

        this.logger.info("[getPageList] completed")
        return data

    }

    /**
     * 删除登录会话
     *
     * @param {DeleteRequestDto} params 删除参数
     * @returns {Promise<void>}
     */
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async delete (params: DeleteRequestDto): Promise<void> {

        this.logger.info("[delete] started")

        await this.checkLoginSessionExists(params.id)
        await this.loginSessionRepository.deleteById(params.id)

        this.logger.info("[delete] completed")

    }

    /**
     * 根据用户ID数组删除所有登录会话
     *
     * @param {number[]} userIds 用户ID数组
     * @returns {Promise<void>}
     */
    public async deleteByUserIds (userIds: number[]): Promise<void> {

        this.logger.info("[deleteByUserIds] started")
        await this.loginSessionRepository.deleteMany({ where: { userId: { in: userIds } } })
        this.logger.info("[deleteByUserIds] completed")

    }

    /**
     * 创建登录会话
     *
     * @param {Prisma.SysLoginSessionCreateArgs["data"]} params 创建参数
     * @returns {Promise<void>}
     */
    public async create (params: Prisma.SysLoginSessionCreateArgs["data"]): Promise<void> {

        this.logger.info("[create] started")

        const { refreshToken, ...rest } = params

        const hashedRefreshToken = this.cryptoService.computeHmac(refreshToken)

        await this.checkRefreshTokenNotExists(hashedRefreshToken)

        const createData: Prisma.SysLoginSessionCreateArgs["data"] = {
            ...rest,
            refreshToken: hashedRefreshToken
        }

        await this.loginSessionRepository.create(createData)

        this.logger.info("[create] completed")

    }

    /**
     * 根据刷新令牌查询登录会话
     *
     * @param {string} refreshToken 刷新令牌
     * @returns {Promise<SysLoginSession | null>} 会话信息
     */
    public async findByRefreshToken (refreshToken: string): Promise<SysLoginSession | null> {

        this.logger.info("[findByRefreshToken] started")

        const hashedRefreshToken = this.cryptoService.computeHmac(refreshToken)

        const data = await this.loginSessionRepository.findFirst({
            where: { refreshToken: hashedRefreshToken }
        })

        this.logger.info("[findByRefreshToken] completed")
        return data

    }

    /**
     * 更新刷新令牌
     *
     * @param {{ id: number; refreshToken: string }} params 更新参数
     * @param {number} params.id 会话ID
     * @param {string} params.refreshToken 新的刷新令牌
     * @returns {Promise<void>}
     */
    public async updateRefreshToken (params: { id: number; refreshToken: string }): Promise<void> {

        this.logger.info("[updateRefreshToken] started")

        await this.checkLoginSessionExists(params.id)

        const hashedRefreshToken = this.cryptoService.computeHmac(params.refreshToken)

        await this.checkRefreshTokenNotExists(hashedRefreshToken)

        await this.loginSessionRepository.updateById(params.id, { refreshToken: hashedRefreshToken })

        this.logger.info("[updateRefreshToken] completed")

    }

    /**
     * 根据刷新令牌删除登录会话
     *
     * @param {string} refreshToken 刷新令牌
     * @returns {Promise<void>}
     */
    public async deleteByRefreshToken (refreshToken: string): Promise<void> {

        this.logger.info("[deleteByRefreshToken] started")

        const hashedRefreshToken = this.cryptoService.computeHmac(refreshToken)

        await this.loginSessionRepository.deleteMany({
            where: { refreshToken: hashedRefreshToken }
        })

        this.logger.info("[deleteByRefreshToken] completed")

    }

    /**
     * 清理已过期的登录会话
     *
     * @returns {Promise<void>}
     */
    @Job("login-session:cleanup")
    @Transactional<TransactionalAdapterPrisma<DatabaseService>>()
    public async cleanup (): Promise<void> {

        await this.loginSessionRepository.deleteMany({
            where: {
                expiresAt: { lt: new Date() }
            }
        })

    }

    /**
     * 构建查询条件
     *
     * @param {GetListRequestDto} params 查询参数
     * @returns {Prisma.SysLoginSessionWhereInput} 查询条件
     */
    private buildQueryWhere (params: GetListRequestDto): Prisma.SysLoginSessionWhereInput {

        const { ip, username } = params

        return {
            ...ip && { ip: { contains: ip } },
            ...username && { username: { contains: username } }
        }

    }

    /**
     * 检查登录会话是否存在
     *
     * @param {number} id 会话ID
     * @returns {Promise<SysLoginSession>} 会话信息
     * @throws {BusinessLogicException} 会话不存在时抛出异常
     */
    private async checkLoginSessionExists (id: number): Promise<SysLoginSession> {

        const loginSession = await this.loginSessionRepository.findById(id)
        if (!loginSession) {

            throw new BusinessLogicException("登录会话不存在")

        }
        return loginSession

    }

    /**
     * 检查刷新令牌是否不存在
     *
     * @param {string} hashedRefreshToken 哈希后的刷新令牌
     * @returns {Promise<void>}
     */
    private async checkRefreshTokenNotExists (hashedRefreshToken: string): Promise<void> {

        const exists = await this.loginSessionRepository.exists({ refreshToken: hashedRefreshToken })
        if (exists) {

            throw new BusinessLogicException("刷新令牌已存在")

        }

    }

}

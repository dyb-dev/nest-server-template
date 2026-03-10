/*
 * @FileDesc: 加解密服务
 */

import { createCipheriv, createDecipheriv, constants, privateDecrypt, publicEncrypt, randomBytes, createHmac } from "node:crypto"

import { Injectable } from "@nestjs/common"

import { CryptoRequestDto, CryptoResponseDto } from "@/dtos"
import { CryptoOperationException } from "@/exceptions"

const { VITE_RSA_PUBLIC_SECRET, VITE_RSA_PRIVATE_SECRET, VITE_AES_SECRET, VITE_HMAC_SECRET } = import.meta.env

/** 加解密服务 */
@Injectable()
export class CryptoService {

    /** RSA 填充方式 */
    private readonly RSA_PADDING = constants.RSA_PKCS1_OAEP_PADDING

    /** RSA OAEP Hash 算法 */
    private readonly RSA_OAEP_HASH = "sha256"

    /** AES 算法 */
    private readonly AES_ALGORITHM = "aes-256-gcm"

    /** AES-256-GCM IV 长度（字节） */
    private readonly AES_IV_LENGTH = 12

    /** AES-256-GCM 认证标签长度（字节） */
    private readonly AES_AUTH_TAG_LENGTH = 16

    /** HMAC 算法 */
    private readonly HMAC_ALGORITHM = "sha256"

    /**
     * RSA 加密
     *
     * @param {string} data 待加密的明文数据
     * @returns {string} 加密后的 Base64 字符串
     */
    public rsaEncrypt (data: string): string {

        const encrypted = publicEncrypt(
            { key: VITE_RSA_PUBLIC_SECRET, padding: this.RSA_PADDING, oaepHash: this.RSA_OAEP_HASH },
            Buffer.from(data, "utf-8")
        )
        return encrypted.toString("base64")

    }

    /**
     * RSA 解密
     *
     * @param {string} encryptedData 待解密的 Base64 字符串
     * @returns {string} 解密后的明文数据
     */
    public rsaDecrypt (encryptedData: string): string {

        const decrypted = privateDecrypt(
            { key: VITE_RSA_PRIVATE_SECRET, padding: this.RSA_PADDING, oaepHash: this.RSA_OAEP_HASH },
            Buffer.from(encryptedData, "base64")
        )
        return decrypted.toString("utf-8")

    }

    /**
     * AES-256-GCM 加密
     *
     * @param {string} data 待加密的明文数据
     * @param {string} aesSecret AES 密钥（hex 字符串）
     * @returns {{ encryptedData: string; iv: string; authTag: string }} 加密结果
     */
    public aesEncrypt (data: string, aesSecret: string): { encryptedData: string; iv: string; authTag: string } {

        const iv = randomBytes(this.AES_IV_LENGTH)
        const cipher = createCipheriv(this.AES_ALGORITHM, Buffer.from(aesSecret, "hex"), iv, {
            authTagLength: this.AES_AUTH_TAG_LENGTH
        })

        const encryptedData = Buffer.concat([cipher.update(data, "utf-8"), cipher.final()])
        const authTag = cipher.getAuthTag()

        return {
            encryptedData: encryptedData.toString("base64"),
            iv: iv.toString("base64"),
            authTag: authTag.toString("base64")
        }

    }

    /**
     * AES-256-GCM 解密
     *
     * @param {string} encryptedData 待解密的 Base64 字符串
     * @param {string} iv 初始化向量（Base64）
     * @param {string} authTag 认证标签（Base64）
     * @param {string} aesSecret AES 密钥（hex 字符串）
     * @returns {string} 解密后的明文数据
     */
    public aesDecrypt (encryptedData: string, iv: string, authTag: string, aesSecret: string): string {

        const decipher = createDecipheriv(this.AES_ALGORITHM, Buffer.from(aesSecret, "hex"), Buffer.from(iv, "base64"), {
            authTagLength: this.AES_AUTH_TAG_LENGTH
        })

        decipher.setAuthTag(Buffer.from(authTag, "base64"))

        const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, "base64")), decipher.final()])

        return decrypted.toString("utf-8")

    }

    /**
     * 加密敏感字段
     *
     * @param {string} value 待加密的明文字段值
     * @returns {string} 拼接后的加密字符串
     */
    public encryptField (value: string): string {

        try {

            const { encryptedData, iv, authTag } = this.aesEncrypt(value, VITE_AES_SECRET)
            return `${encryptedData}:${iv}:${authTag}`

        }
        catch (error) {

            throw new CryptoOperationException("字段加密失败")

        }

    }

    /**
     * 解密敏感字段
     *
     * @param {string} value 数据库中存储的加密字符串
     * @returns {string} 解密后的明文字段值
     */
    public decryptField (value: string): string {

        const parts = value.split(":")

        if (parts.length !== 3) {

            throw new CryptoOperationException("字段格式非法")

        }

        try {

            const [encryptedData, iv, authTag] = parts
            return this.aesDecrypt(encryptedData, iv, authTag, VITE_AES_SECRET)

        }
        catch (error) {

            throw new CryptoOperationException("字段解密失败")

        }

    }

    /**
     * 解密请求数据
     *
     * @param {CryptoRequestDto} body 请求加密载体
     * @returns {{ decryptedData: unknown; aesSecret: string }} 解密后的数据及 AES 密钥
     */
    public decryptRequestData (body: CryptoRequestDto): { decryptedData: unknown; aesSecret: string } {

        if (!body.encryptedSecret || !body.encryptedData || !body.iv || !body.authTag) {

            throw new CryptoOperationException("请求加密载体不完整")

        }

        try {

            const aesSecret = this.rsaDecrypt(body.encryptedSecret)
            const raw = this.aesDecrypt(body.encryptedData, body.iv, body.authTag, aesSecret)

            return {
                decryptedData: JSON.parse(raw),
                aesSecret
            }

        }
        catch (error) {

            throw new CryptoOperationException("请求数据解密失败")

        }

    }

    /**
     * 加密响应数据
     *
     * @param {unknown} data 待加密的响应数据
     * @param {string} aesSecret AES 密钥（hex 字符串）
     * @returns {CryptoResponseDto} 加密结果
     */
    public encryptResponseData (data: unknown, aesSecret: string): CryptoResponseDto {

        try {

            return this.aesEncrypt(JSON.stringify(data), aesSecret)

        }
        catch (error) {

            throw new CryptoOperationException("响应数据加密失败")

        }

    }

    /**
     * 计算 HMAC-SHA256
     *
     * @param {string} value 待计算 HMAC 的字符串
     * @returns {string} HMAC-SHA256 摘要的 hex 字符串
     */
    public computeHmac (value: string): string {

        return createHmac(this.HMAC_ALGORITHM, VITE_HMAC_SECRET).update(value).digest("hex")

    }

}

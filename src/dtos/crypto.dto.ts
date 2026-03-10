/*
 * @FileDesc: 加解密 DTO
 */

/** 加解密基础信息 DTO */
export class CryptoBaseDto {

    /** AES 加密后的数据（Base64） */
    encryptedData: string
    /** AES 初始化向量（Base64） */
    iv: string
    /** AES 认证标签（Base64） */
    authTag: string

}

/** 加解密请求 DTO */
export class CryptoRequestDto extends CryptoBaseDto {

    /** RSA 加密后的 AES 密钥（Base64） */
    encryptedSecret: string

}

/** 加解密响应 DTO */
export class CryptoResponseDto extends CryptoBaseDto {}

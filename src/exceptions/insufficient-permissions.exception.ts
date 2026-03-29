/*
 * @FileDesc: 权限不足异常
 */

import { HttpException } from "@nestjs/common"

import { RESPONSE_CODE_TO_MESSAGE } from "@/constants"

import { EResponseCode } from "@/types"

/** 权限不足异常 */
export class InsufficientPermissionsException extends HttpException {

    public constructor (message: string = RESPONSE_CODE_TO_MESSAGE[EResponseCode.InsufficientPermissions]) {

        super(message, EResponseCode.InsufficientPermissions)

    }

}

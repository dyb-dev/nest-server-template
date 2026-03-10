/*
 * @FileDesc: 业务逻辑异常
 */

import { HttpException } from "@nestjs/common"

import { RESPONSE_CODE_TO_MESSAGE } from "@/constants"

import { EResponseCode } from "@/types"

/** 业务逻辑异常 */
export class BusinessLogicException extends HttpException {

    public constructor (message: string = RESPONSE_CODE_TO_MESSAGE[EResponseCode.BusinessLogicError]) {

        super(message, EResponseCode.BusinessLogicError)

    }

}

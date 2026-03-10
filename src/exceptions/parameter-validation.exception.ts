/*
 * @FileDesc: 参数验证异常
 */

import { HttpException } from "@nestjs/common"

import { RESPONSE_CODE_TO_MESSAGE } from "@/constants"

import { EResponseCode } from "@/types"

/** 参数验证异常 */
export class ParameterValidationException extends HttpException {

    public constructor (message: string = RESPONSE_CODE_TO_MESSAGE[EResponseCode.ParameterValidationError]) {

        super(message, EResponseCode.ParameterValidationError)

    }

}

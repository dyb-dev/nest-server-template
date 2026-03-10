/*
 * @FileDesc: 重放请求异常
 */

import { HttpException } from "@nestjs/common"

import { RESPONSE_CODE_TO_MESSAGE } from "@/constants"

import { EResponseCode } from "@/types"

/** 重放请求异常 */
export class ReplayRequestException extends HttpException {

    public constructor (message: string = RESPONSE_CODE_TO_MESSAGE[EResponseCode.ReplayRequestRejected]) {

        super(message, EResponseCode.ReplayRequestRejected)

    }

}

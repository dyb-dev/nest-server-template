/*
 * @FileDesc: 健康检查异常
 */

import { HttpException } from "@nestjs/common"

import { RESPONSE_CODE_TO_MESSAGE } from "@/constants"

import { EResponseCode } from "@/types"

/** 健康检查异常 */
export class HealthCheckException extends HttpException {

    public constructor (message: string = RESPONSE_CODE_TO_MESSAGE[EResponseCode.HealthCheckFailed]) {

        super(message, EResponseCode.HealthCheckFailed)

    }

}

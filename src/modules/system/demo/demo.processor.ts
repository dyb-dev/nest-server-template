/*
 * @FileDesc: Demo 队列处理器
 */

import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq"
import { InjectPinoLogger } from "nestjs-pino"

import type { Job } from "bullmq"
import type { PinoLogger } from "nestjs-pino"

/** Demo 队列名称 */
export const DEMO_QUEUE = "demo"

/** Demo 队列处理器 */
@Processor(DEMO_QUEUE)
export class DemoProcessor extends WorkerHost {

    /** 日志记录器 */
    @InjectPinoLogger(DemoProcessor.name)
    private readonly logger: PinoLogger

    /**
     * 监听任务激活事件
     *
     * @param {Job} job 任务
     */
    @OnWorkerEvent("active")
    public onActive (job: Job): void {

        this.logger.info({ name: job.name }, "Job started")

    }

    /**
     * 处理任务
     *
     * @param {Job} job 任务
     * @returns {Promise<{ message: string }>} 处理结果
     */
    public async process (job: Job): Promise<{ message: string }> {

        this.logger.info(
            {
                name: job.name,
                data: job.data
            },
            "Job processing"
        )
        return {
            message: "success"
        }

    }

    /**
     * 监听任务完成事件
     *
     * @param {Job} job 任务
     * @param {{ message: string }} result 任务处理结果
     * @param {string} result.message 结果消息
     */
    @OnWorkerEvent("completed")
    public onCompleted (job: Job, result: { message: string }): void {

        this.logger.info(
            {
                name: job.name,
                result
            },
            "Job completed"
        )

    }

    /**
     * 监听任务失败事件
     *
     * @param {Job} job 任务
     * @param {Error} error 错误信息
     */
    @OnWorkerEvent("failed")
    public onFailed (job: Job, error: Error): void {

        this.logger.error(
            {
                name: job.name,
                error
            },
            "Job failed"
        )

    }

}

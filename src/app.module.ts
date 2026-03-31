/*
 * @FileDesc: App 模块
 */

import { Module } from "@nestjs/common"
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core"
import { ThrottlerGuard } from "@nestjs/throttler"
import cookieParser from "cookie-parser"
import helmet from "helmet"

import { GlobalExceptionFilter } from "@/exception-filters"
import { CsrfGuard, AuthGuard, ReplayGuard, PermissionGuard } from "@/guards"
import { CryptoInterceptor, LoggerInterceptor, ResponseInterceptor, SensitiveFieldsInterceptor } from "@/interceptors"
import { LoggerMiddleware } from "@/middlewares"
import { CoreModule, SharedModule, SchedulerModule, MonitorModule, SystemModule, AuthModule } from "@/modules"
import { ValidationPipe } from "@/pipes"

import type { MiddlewareConsumer, NestModule } from "@nestjs/common"

/** App 模块 */
@Module({
    imports: [CoreModule.forRoot(), SharedModule, SchedulerModule, MonitorModule, SystemModule, AuthModule],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
        {
            provide: APP_GUARD,
            useClass: CsrfGuard
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
        {
            provide: APP_GUARD,
            useClass: ReplayGuard
        },
        {
            provide: APP_GUARD,
            useClass: PermissionGuard
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggerInterceptor
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CryptoInterceptor
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: SensitiveFieldsInterceptor
        },
        {
            provide: APP_PIPE,
            useClass: ValidationPipe
        },
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter
        }
    ]
})
export class AppModule implements NestModule {

    public configure (consumer: MiddlewareConsumer) {

        consumer.apply(helmet(), cookieParser(), LoggerMiddleware).forRoutes("*path")

    }

}

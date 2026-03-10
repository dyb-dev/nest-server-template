/*
 * @FileDesc: 数据库模块
 */

import { DatabaseService } from "./database.service"

import type { DynamicModule } from "@nestjs/common"

/** 数据库模块 */
export class DatabaseModule {

    static forRoot (): DynamicModule {

        return {
            module: DatabaseModule,
            global: true,
            providers: [DatabaseService],
            exports: [DatabaseService]
        }

    }

}

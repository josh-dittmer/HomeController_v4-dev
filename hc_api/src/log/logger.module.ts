import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LoggerMiddleware } from "./logger.middleware";
import { HCLogger } from "./logger.service";

@Module({
    providers: [
        HCLogger.register()
    ],
    exports: [
        HCLogger
    ]
})
export class LoggingModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
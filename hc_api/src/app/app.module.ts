import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingModule } from '../log/logger.module';
import { AppController } from './app.controller';
import { DeviceController } from './controllers/device_controller';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
    imports: [LoggingModule],
    controllers: [
        AppController,
        DeviceController
    ],
    providers: [
        AuthMiddleware
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes(
            DeviceController
        );
    }
}

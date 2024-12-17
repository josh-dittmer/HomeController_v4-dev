import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app/app.module';
import { HCLogger } from './log/logger.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    })

    app.useLogger(app.get(HCLogger));

    await app.listen(process.env.PORT);
}

bootstrap();

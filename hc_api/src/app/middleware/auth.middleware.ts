import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private readonly logger = new Logger('Auth');

    use(request: Request, response: Response, next: NextFunction) {
        const token = request.cookies.accessToken;

        if (token) {
            this.logger.log('yes token');
        } else {
            this.logger.log('no token');
        }

        next();
    }
}
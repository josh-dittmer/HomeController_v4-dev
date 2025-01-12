import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from 'express';
import { unauthorized } from "../../common/responses.js";
import { verify } from "../../util/token.js";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private readonly logger = new Logger('AuthManager');

    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return unauthorized(res);
        }

        const token = req.headers.authorization.substring(7);

        try {
            const data = await verify(token);

            res.locals.userId = data.sub!; // checked in verify()
            res.locals.userEmail = data.email;

            this.logger.verbose(`Request is authorized for [${data.email}/${data.sub}]`)
        } catch {
            return unauthorized(res);
        }

        next();
    }
}
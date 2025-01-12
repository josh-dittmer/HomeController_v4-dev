import { Response } from "express";

export function unauthorized(res: Response) {
    res.status(401).send({
        message: 'client is unauthorized'
    });
}
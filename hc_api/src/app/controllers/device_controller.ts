import { Controller, Delete, Logger, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from 'express';

@Controller('device')
export class DeviceController {
    private readonly logger = new Logger('Device');

    @Post('create')
    async create(@Req() req: Request, @Res() res: Response) {
        res.json({ message: 'test' });
    }

    @Post(':id/edit')
    async edit(@Req() req: Request, @Res() res: Response) {
        res.json({ message: 'test' });
    }

    @Delete(':id/delete')
    async delete(@Req() req: Request, @Res() res: Response) {
        res.json({ message: 'test' });
    }
}
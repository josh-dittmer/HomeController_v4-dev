import { Controller, Delete, Get, Logger, Param, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from 'express';
import { GetAllDevicesResponseT, GetOneDeviceResponseT } from "hc_models/models";
import { notFound } from "../../common/responses.js";
import { HCService } from "../../hc/hc.service.js";
import { HCGateway } from "../gateway/gateway.js";

@Controller('device')
export class DeviceController {
    private readonly logger = new Logger('DeviceController');

    constructor(private readonly hc: HCService, private readonly gateway: HCGateway) { }

    @Get('all')
    async getAll(@Req() req: Request, @Res() res: Response) {
        const devices = await this.hc.deviceRepository.getAll(res.locals.userId);

        const result: GetAllDevicesResponseT = {
            onlineDevices: [],
            offlineDevices: []
        }

        const onlineDeviceIds = await this.gateway.getOnlineDevices(res.locals.userId);

        devices.forEach((device) => {
            if (onlineDeviceIds.has(device.deviceId)) {
                result.onlineDevices.push(device);
            } else {
                result.offlineDevices.push(device);
            }
        });

        res.json(result);
    }

    @Get(':id')
    async getOne(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const device = await this.hc.deviceRepository.getOne(res.locals.userId, id);

        if (!device) {
            return res.json(notFound(res, id));
        }

        const result: GetOneDeviceResponseT = {
            device: device,
            online: await this.gateway.isDeviceOnline(res.locals.userId, device.deviceId)
        };

        res.json(result);
    }

    @Post('create')
    async create(@Req() req: Request, @Res() res: Response) {
        res.json({ message: 'test' });
    }

    @Post(':id/edit')
    async edit(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        res.json({ message: 'test' });
    }

    @Delete(':id/delete')
    async delete(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        res.json({ message: 'test' });
    }
}
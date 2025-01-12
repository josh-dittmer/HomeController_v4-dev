import { Controller, Delete, Get, Logger, Param, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from 'express';
import { GetAllDevicesResponseT } from "hc_models/models";
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
        res.json({ message: id });
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
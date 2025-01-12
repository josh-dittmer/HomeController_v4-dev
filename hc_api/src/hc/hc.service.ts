import { Injectable } from "@nestjs/common";
import { DeviceRepository } from "../app/repositories/device.repository.js";
import { TicketRepository } from "../app/repositories/ticket.repository.js";

@Injectable()
export class HCService {
    deviceRepository: DeviceRepository;
    ticketRepository: TicketRepository;

    constructor(deviceRepository: DeviceRepository, ticketRepository: TicketRepository) {
        this.deviceRepository = deviceRepository;
        this.ticketRepository = ticketRepository;
    }

    static register() {
        return {
            provide: HCService,
            useFactory: () => {
                const deviceRepository = new DeviceRepository();
                const ticketRepository = new TicketRepository();

                return new HCService(deviceRepository, ticketRepository);
            }
        }
    }
}
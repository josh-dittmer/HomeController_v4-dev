import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ClientTypeT } from "hc_models/values";
import { Namespace, Server, Socket } from "socket.io";
import { API_PREFIX, CORS_ALLOWED_ORIGIN } from "../../common/values.js";
import { HCService } from "../../hc/hc.service.js";
import { authMiddleware } from "./auth.js";

interface ServerToClientEvents {
    // sent to users
    userCheckStateReply: (data: Buffer | null) => void;
    userStateChanged: (deviceId: string, data: Buffer) => void;
    userDeviceDisconnected: (deviceId: string) => void;

    // sent to devices
    deviceCheckStateRequest: (socketId: string) => void;
    deviceCommand: (data: Buffer) => void;
}

interface ClientToServerEvents {
    // sent from users
    userCheckStateRequest: (deviceId: string) => void;
    userCommand: (deviceId: string, data: Buffer) => void;

    // sent from devices
    deviceCheckStateReply: (socketId: string, data: Buffer) => void;
    deviceStateChanged: (data: Buffer) => void;
}

interface InterServerEvents {

}

interface SocketData {
    type: ClientTypeT,
    userId?: string,
    deviceId?: string,
    ownerId?: string,
    checkStateCallbackQueue?: Array<(reply: Buffer) => void>
}

export type HCGatewayServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type HCGatewayNamespace = Namespace<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type HCGatewaySocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

@WebSocketGateway({
    path: `${API_PREFIX}/gateway`,
    cors: {
        origin: CORS_ALLOWED_ORIGIN
    }
})
export class HCGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server!: HCGatewayServer;

    private namespace = () => this.server.of(API_PREFIX);

    private readonly logger = new Logger('Gateway');

    constructor(private readonly hc: HCService) { }

    async afterInit(server: Server) {
        server.use(authMiddleware(this.hc, this.namespace, this.logger));
    }

    async handleConnection(socket: HCGatewaySocket) {
        switch (socket.data.type) {
            case 'user':
                this.handleUserConnect(socket);
                break;
            case 'device':
                this.handleDeviceConnect(socket);
                break;
        }
    }

    async handleDisconnect(socket: HCGatewaySocket) {
        switch (socket.data.type) {
            case 'user':
                this.handleUserDisconnect(socket);
                break;
            case 'device':
                this.handleDeviceDisconnect(socket);
                break;
        }
    }

    async getOnlineDevices(userId: string): Promise<Set<string>> {
        const sockets = await this.namespace().in(`owner_${userId}`).fetchSockets();

        const devices: Set<string> = new Set<string>();
        sockets.forEach((socket) => {
            if (socket.data.deviceId) {
                devices.add(socket.data.deviceId)
            }
        });

        return devices;
    }

    private async handleUserConnect(socket: HCGatewaySocket) {
        socket.join(`user_${socket.data.userId}`);

        socket.data.checkStateCallbackQueue = new Array<(reply: Buffer) => void>;

        socket.on('userCheckStateRequest', async (deviceId: string) => {
            const sockets = await this.server.in(`device_${deviceId}`).fetchSockets();

            if (sockets.length === 0) {
                socket.emit('userCheckStateReply', null);
                this.logger.debug(`Received userCheckStateReply from [user/${socket.data.userId}] for invalid/offline device`);
                return;
            }

            const deviceSocket = sockets[0];

            if (deviceSocket.data.ownerId !== socket.data.userId) {
                socket.emit('userCheckStateReply', null);
                this.logger.debug(`Received userCheckStateReply from [user/${socket.data.userId}] for a disallowed device`);
                return;
            }

            let timedOut = false;

            const timeout = setTimeout(() => {
                timedOut = true;
                socket.emit('userCheckStateReply', null);
                this.logger.warn(`State check request to [device/${deviceId}] timed out`);
            }, 5000);

            socket.data.checkStateCallbackQueue?.push((data: Buffer) => {
                if (!timedOut) {
                    clearTimeout(timeout);

                    this.logger.verbose(`userCheckStateReply -> [user/${socket.data.userId}]`);
                    socket.emit('userCheckStateReply', data);
                } else {
                    this.logger.debug(`State check reply from [device/${deviceId}] received after timeout`);
                }
            });

            this.logger.verbose(`deviceCheckStateRequest -> [device/${deviceId}]`);

            this.namespace().in(`device_${deviceId}`).emit('deviceCheckStateRequest', socket.id);
        });

        socket.on('userCommand', (deviceId: string, data: Buffer) => {

        });

        this.logger.log(`[user/${socket.data.userId}] has connected`);
    }

    private async handleDeviceConnect(socket: HCGatewaySocket) {
        socket.join(`device_${socket.data.deviceId}`);
        socket.join(`owner_${socket.data.ownerId}`);

        socket.on('deviceCheckStateReply', async (socketId: string, data: Buffer) => {
            const sockets = await this.server.in(socketId).fetchSockets();

            if (sockets.length !== 1) {
                this.logger.debug('Received deviceCheckStateReply for bad socket ID');
                return;
            }

            const userSocket = sockets[0];

            if (socket.data.ownerId !== userSocket.data.userId) {
                this.logger.debug('Received deviceCheckStateReply for disallowed socket ID');
                return;
            }

            const cb = userSocket.data.checkStateCallbackQueue?.shift();

            if (cb) {
                cb(data);
            }
        });

        socket.on('deviceStateChanged', (data: Buffer) => {

        });

        this.logger.verbose(`[device/${socket.data.deviceId}] owned by [user/${socket.data.ownerId}]`);
        this.logger.log(`[device/${socket.data.deviceId}] has connected`);
    }

    private async handleUserDisconnect(socket: HCGatewaySocket) {
        this.logger.log(`[user/${socket.data.userId}] has disconnected`);
    }

    private async handleDeviceDisconnect(socket: HCGatewaySocket) {
        if (socket.data.deviceId && socket.data.ownerId) {
            this.namespace().in(`owner_${socket.data.ownerId}`).emit('userDeviceDisconnected', socket.data.deviceId);
        }

        this.logger.log(`[device/${socket.data.deviceId}] has disconnected`);
    }

}
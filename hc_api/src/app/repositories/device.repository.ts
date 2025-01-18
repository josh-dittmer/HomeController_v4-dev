import { eq } from "drizzle-orm";
import { DeviceArrayT } from "hc_models/models";
import { db } from "../../db/db.js";
import { devicesTable } from "../../db/schema.js";
import { verifySecret } from "../../util/secret.js";

export class DeviceRepository {
    async getAll(userId: string): Promise<DeviceArrayT> {
        const devices: DeviceArrayT = await db.select({
            deviceId: devicesTable.deviceId,
            type: devicesTable.type,
            name: devicesTable.name,
            description: devicesTable.description,
        })
            .from(devicesTable)
            .where(eq(devicesTable.userId, userId));

        return devices;
    }

    async checkSecret(deviceId: string, secret: string): Promise<string> {
        const devices = await db.select({
            deviceId: devicesTable.deviceId,
            userId: devicesTable.userId,
            secretHash: devicesTable.secretHash
        })
            .from(devicesTable)
            .where(eq(devicesTable.deviceId, deviceId));

        if (devices.length === 0) {
            throw new Error('device not found');
        }

        const valid = await verifySecret(secret, devices[0].secretHash);

        if (!valid) {
            throw new Error('bad device secret');
        }

        return devices[0].userId;
    }
}
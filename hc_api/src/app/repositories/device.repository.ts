import { eq } from "drizzle-orm";
import { DeviceArrayT } from "hc_models/models";
import { db } from "../../db/db.js";
import { devicesTable } from "../../db/schema.js";

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
}
import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { DeviceNames, DeviceSecretLength, MaxDeviceDescriptionLength, MaxDeviceNameLength, MaxUserNameLength } from "src/common/values";

export const usersTable = pgTable('users', {
    userId: uuid().primaryKey().unique().notNull(),
    name: varchar({ length: MaxUserNameLength }).notNull()
});

export const deviceTypeEnum = pgEnum('device_type', [
    DeviceNames.rgbLights, DeviceNames.testDevice
]);

export const devicesTable = pgTable('devices', {
    deviceId: uuid().primaryKey().notNull().$default(() => crypto.randomUUID()),
    secretHash: varchar({ length: DeviceSecretLength }).notNull(),
    userId: uuid().notNull().references(() => usersTable.userId),
    name: varchar({ length: MaxDeviceNameLength }).notNull(),
    description: varchar({ length: MaxDeviceDescriptionLength }).notNull(),
    type: deviceTypeEnum().notNull()
})
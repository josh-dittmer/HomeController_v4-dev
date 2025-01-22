import * as t from 'io-ts';

//export * from './values';

export const Device = t.type({
    deviceId: t.string,
    type: t.string,
    name: t.string,
    description: t.string
});

export type DeviceT = t.TypeOf<typeof Device>;

export const DeviceArray = t.array(Device);
export type DeviceArrayT = t.TypeOf<typeof DeviceArray>;

export const GetAllDevicesResponse = t.type({
    onlineDevices: DeviceArray,
    offlineDevices: DeviceArray
})

export type GetAllDevicesResponseT = t.TypeOf<typeof GetAllDevicesResponse>;

export const GetOneDeviceResponse = t.type({
    device: Device,
    online: t.boolean
})

export type GetOneDeviceResponseT = t.TypeOf<typeof GetOneDeviceResponse>;

export const TicketResponse = t.type({
    ticket: t.string
})

export type TicketResponseT = t.TypeOf<typeof TicketResponse>;
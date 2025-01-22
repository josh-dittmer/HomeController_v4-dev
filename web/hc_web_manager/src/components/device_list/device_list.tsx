'use client';

import { useAllDevicesQuery } from "@/lib/queries/all_devices";
import { DeviceArrayT, DeviceT } from "hc_models/models";
import { OfflineDeviceCard } from "./cards/offline_card";
import { RGBLightsCard } from "./cards/rgb_lights_card";

export default function DeviceList({ onlineDevices, offlineDevices }: { onlineDevices: DeviceArrayT, offlineDevices: DeviceArrayT }) {
    const { data } = useAllDevicesQuery({
        onlineDevices: onlineDevices,
        offlineDevices: offlineDevices
    });

    return (
        <div className="p-4 overflow-y-scroll h-[calc(100vh-80px)]">
            {data.onlineDevices.length > 0 && (
                <>
                    <div className="w-full pb-1 border-bg-dark flex justify-center sm:justify-start">
                        <p className="text-xs text-fg-medium">ONLINE DEVICES ({data.onlineDevices.length})</p>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start">
                        {data.onlineDevices.map((device: DeviceT) =>
                            <div key={device.deviceId} className="pt-4 pr-4">
                                {device.type === 'test_device' ? (
                                    <RGBLightsCard key={device.deviceId} device={device} />
                                ) : (
                                    <p key={device.deviceId}>Unknown device type</p>
                                )
                                }
                            </div>
                        )}
                    </div>
                </>
            )}
            {data.offlineDevices.length > 0 && (
                <>
                    <div className="w-full pb-1 border-bg-dark flex justify-center sm:justify-start">
                        <p className="text-xs text-fg-medium">OFFLINE DEVICES ({data.offlineDevices.length})</p>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start">
                        {data.offlineDevices.map((device: DeviceT) =>
                            <div key={device.deviceId} className="pt-4 pr-4">
                                <OfflineDeviceCard device={device} />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
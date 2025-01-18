'use client';

import { DeviceT } from "hc_models/models";

export function OfflineDeviceCard({ device }: { device: DeviceT }) {
    return (
        <div className="bg-bg-dark rounded w-64">
            <div className="p-3 flex items-center">
                <div className="grow flex justify-center">
                    <h1 className="text-fg-dark">{device.name}</h1>
                </div>
            </div>
            <div className="p-3 bg-bg-medium flex justify-center items-center">
                <p className="text-xs text-fg-medium">OFFLINE</p>
            </div>
        </div>
    )
}


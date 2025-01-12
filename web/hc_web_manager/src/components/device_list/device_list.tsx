import { DeviceArrayT } from "hc_models/models";
import { OfflineDeviceCard, OnlineDeviceCard } from "./device_card";

export default async function DeviceList({ onlineDevices, offlineDevices }: { onlineDevices: DeviceArrayT, offlineDevices: DeviceArrayT }) {
    return (
        <div className="p-4">
            {onlineDevices.length > 0 && (
                <>
                    <div className="w-full pb-1 border-b2 border-bg-dark">
                        <p className="text-xs text-fg-medium">ONLINE DEVICES ({onlineDevices.length})</p>
                    </div>
                    <div className="pt-2">
                        {onlineDevices.map((device) => <OnlineDeviceCard key={device.deviceId} device={device} />)}
                    </div>
                </>
            )}
            {offlineDevices.length > 0 && (
                <>
                    <div className="w-full pb-1 border-b2 border-bg-dark">
                        <p className="text-sm text-fg-medium">OFFLINE DEVICES ({offlineDevices.length})</p>
                    </div>
                    <div className="pt-2">
                        {offlineDevices.map((device) => <OfflineDeviceCard key={device.deviceId} device={device} />)}
                    </div>
                </>
            )}
        </div>
    )
}
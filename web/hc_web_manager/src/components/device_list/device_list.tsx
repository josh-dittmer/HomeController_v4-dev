import { DeviceArrayT, DeviceT } from "hc_models/models";
import { OfflineDeviceCard } from "./cards/offline_card";
import { RGBLightsCard } from "./cards/rgb_lights_card";

export default async function DeviceList({ onlineDevices, offlineDevices }: { onlineDevices: DeviceArrayT, offlineDevices: DeviceArrayT }) {
    return (
        <div className="pt-4 pl-4">
            {onlineDevices.length > 0 && (
                <>
                    <div className="w-full pb-1 border-b2 border-bg-dark">
                        <p className="text-xs text-fg-medium">ONLINE DEVICES ({onlineDevices.length})</p>
                    </div>
                    <div className="pt-4">
                        {onlineDevices.map((device: DeviceT) => {
                            switch (device.type) {
                                case 'test_device': return <RGBLightsCard key={device.deviceId} device={device} />
                                default: return <p key={device.deviceId}>Unknown device type</p>
                            }
                        })}
                    </div>
                </>
            )}
            {offlineDevices.length > 0 && (
                <>
                    <div className="w-full pb-1 border-b2 border-bg-dark">
                        <p className="text-sm text-fg-medium">OFFLINE DEVICES ({offlineDevices.length})</p>
                    </div>
                    <div className="pt-2">
                        {offlineDevices.map((device: DeviceT) => <OfflineDeviceCard key={device.deviceId} device={device} />)}
                    </div>
                </>
            )}
        </div>
    )
}
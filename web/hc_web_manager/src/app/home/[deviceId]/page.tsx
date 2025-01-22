import Header from "@/components/control_panel/header/header";
import RGBLightsControlPanel from "@/components/control_panel/rgb_lights/control_panel";
import { getOneDevice } from "@/lib/api/actions";
import { GetOneDeviceResponseT } from "hc_models/models";
import { WifiOff } from "lucide-react";

function OfflineDisplay() {
    return (
        <>
            <div className="h-[calc(100%-2.5rem)] flex items-center justify-center">
                <WifiOff width={50} height={50} className="text-fg-medium mb-10" />
            </div>
        </>
    )
}

export default async function DevicePage({ params }: { params: Promise<{ deviceId: string }> }) {
    const { deviceId } = await params;
    const res: GetOneDeviceResponseT = await getOneDevice(deviceId);

    return (
        <div className="p-4 w-full h-full">
            <Header device={res.device} />
            {res.online ? (
                res.device.type === 'test_device' ? (
                    <RGBLightsControlPanel device={res.device} online={res.online} />
                ) : (
                    <p>Unknown device type</p>
                )
            ) : (
                <OfflineDisplay />
            )}

        </div>
    )
}
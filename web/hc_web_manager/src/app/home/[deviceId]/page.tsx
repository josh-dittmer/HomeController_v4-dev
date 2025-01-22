import Header from "@/components/control_panel/header/header";
import RGBLightsControlPanel from "@/components/control_panel/rgb_lights/control_panel";
import { getOneDevice } from "@/lib/api/actions";
import { GetOneDeviceResponseT } from "hc_models/models";

export default async function DevicePage({ params }: { params: Promise<{ deviceId: string }> }) {
    const { deviceId } = await params;
    const res: GetOneDeviceResponseT = await getOneDevice(deviceId);

    return (
        <div className="p-4">
            <Header device={res.device} />
            {res.device.type === 'test_device' ? (
                <RGBLightsControlPanel device={res.device} online={res.online} />
            ) : (
                <p>Unknown device type</p>
            )}
        </div>
    )
}
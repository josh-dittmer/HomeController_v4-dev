//import { getAllDevices } from "@/lib/api/actions";

import DeviceList from "@/components/device_list/device_list";
import { getAllDevices } from "@/lib/api/actions";
import { GetAllDevicesResponseT } from "hc_models/models";


export default async function HomePage() {
    const devices: GetAllDevicesResponseT = await getAllDevices();

    return (
        <DeviceList onlineDevices={devices.onlineDevices} offlineDevices={devices.offlineDevices} />
    )
}
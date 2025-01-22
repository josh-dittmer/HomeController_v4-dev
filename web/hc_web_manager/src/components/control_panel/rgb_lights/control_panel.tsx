'use client';

import { useDeviceState } from "@/hooks/device_state";
import { stateDecode } from "@/lib/api/device_data/rgb_lights";
import { DeviceT } from "hc_models/models";
import ColorPreview from "./color_preview";

export default function RGBLightsControlPanel({ device, online }: { device: DeviceT, online: boolean }) {
    const { loading, state, ctx } = useDeviceState(device.deviceId, stateDecode);

    if (!loading && !state) {
        return (
            <p>Something went wrong!</p>
        )
    }

    const ready = state && !loading;

    return (
        <div className="mt-5">
            {ready ? (
                <ColorPreview r={state.r} g={state.g} b={state.b} />
            ) : (
                <ColorPreview r={0} b={0} g={0} />
            )}
        </div>
    )
};
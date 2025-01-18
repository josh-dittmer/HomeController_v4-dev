'use client';

import { useDeviceState } from "@/app/hooks/device_state";
import { LoadingSpinnerImage } from "@/components/loading_spinner/loading_spinner";
import { Commands, stateDecode } from "@/lib/api/devices/rgb_lights";
import { DeviceT } from "hc_models/models";
import { Power } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export function RGBLightsCard({ device }: { device: DeviceT }) {
    const { loading, state, ctx } = useDeviceState(device.deviceId, stateDecode);

    const togglePower = () => {
        ctx?.sendCommand(device.deviceId, state?.powered ? Commands.powerOff() : Commands.powerOn());
    };

    useEffect(() => {
        console.log(state);
    }, [state]);

    if (loading) {
        return (
            <div className="bg-bg-dark rounded w-64">
                <div className="h-20 p-3 flex items-center">
                    <div className="bg-bg-light rounded-full p-3">
                        <LoadingSpinnerImage width={30} height={30} />
                    </div>
                    <div className="grow flex justify-center">
                        <h1 className="text-fg-light">{device.name}</h1>
                    </div>
                </div>
                <div className="h-9 p-3 bg-bg-medium flex justify-center items-center">
                    <p className="text-xs text-fg-medium"></p>
                </div>
            </div>
        )
    }

    if (!loading && !state) {
        return (
            <p>Something went wrong!</p>
        )
    }

    if (!state) return;

    return (
        <motion.div
            className="bg-bg-dark rounded w-64"
            style={{ boxShadow: `0 0 10px 1px rgb(${state.r}, ${state.g}, ${state.b})` }}
        >
            <div className="h-20 p-3 flex items-center">
                <div className="flex justify-center">
                    <motion.button
                        className={`${state.powered ? 'bg-green-600' : 'bg-bg-light'} rounded-full p-3`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={togglePower}
                    >
                        <Power width={30} height={30} className="text-fg-dark" />
                    </motion.button>
                </div>
                <div className="flex grow justify-center">
                    <h1 className="text-fg-dark">{device.name}</h1>
                </div>
            </div>
            <div className="h-9 p-3 bg-bg-medium flex justify-center items-center rounded-b">
                <motion.p
                    className="text-xs text-fg-medium"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                >
                    ONLINE, POWERED {state.powered ? 'ON' : 'OFF'}
                </motion.p>
            </div>
        </motion.div>
    )
}
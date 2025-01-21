'use client';

import { LoadingSpinnerImage } from "@/components/loading_spinner/loading_spinner";
import { useDeviceState } from "@/hooks/device_state";
import { Commands, RGBLightsProgramT, stateDecode } from "@/lib/api/device_data/rgb_lights";
import { DeviceT } from "hc_models/models";
import { Power } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export function RGBLightsCard({ device }: { device: DeviceT }) {
    const { loading, state, ctx } = useDeviceState(device.deviceId, stateDecode);

    const togglePower = () => {
        ctx?.sendCommand(device.deviceId, state?.powered ? Commands.powerOff() : Commands.powerOn());
    };

    const setColor = (r: number, g: number, b: number) => {
        ctx?.sendCommand(device.deviceId, Commands.setColor(r, g, b));
    }

    const startProgram = (program: RGBLightsProgramT) => {
        ctx?.sendCommand(device.deviceId, Commands.startProgram(program));
    };

    const stopProgram = () => {
        ctx?.sendCommand(device.deviceId, Commands.stopProgram());
    };

    useEffect(() => {
        console.log(state);
    }, [state]);

    if (loading) {
        return (
            <div className="bg-bg-dark rounded w-64">
                <div className="h-20 p-3 grid grid-cols-[1fr_3fr] items-center">
                    <div>
                        <div className="bg-bg-light rounded-full p-3 w-fit h-fit">
                            <LoadingSpinnerImage width={30} height={30} />
                        </div>
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
            <div className="h-20 p-3">
                <div className="grid grid-cols-[1fr_3fr] items-center">
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
                <div className="">
                    <button onClick={() => setColor(255, 0, 0)}>Test1</button>
                    <button onClick={() => setColor(0, 0, 255)}>Test2</button>
                    <button onClick={() => startProgram('rainbowFade')}>Start</button>
                    <button onClick={() => stopProgram()}>Stop</button>
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
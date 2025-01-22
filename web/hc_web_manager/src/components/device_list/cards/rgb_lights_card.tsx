'use client';

import { LoadingSpinnerImage } from "@/components/loading_spinner/loading_spinner";
import { useDeviceState } from "@/hooks/device_state";
import { Commands, RGBLightsProgramT, stateDecode } from "@/lib/api/device_data/rgb_lights";
import { DeviceT } from "hc_models/models";
import { Power } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";


function ColorButton({ enabled, r, g, b, setColor }: { enabled: boolean | null, r: number, g: number, b: number, setColor: (r: number, g: number, b: number) => void }) {
    return (
        <>
            {enabled ? (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setColor(r, g, b)}
                >
                    <div
                        style={{
                            backgroundColor: `rgb(${r}, ${g}, ${b})`
                        }}
                        className="border border-fg-dark p-2 rounded"
                    />
                </motion.button>
            ) : (
                <div
                    className="p-2 rounded bg-bg-light"
                />
            )}
        </>
    )
};

function ProgramButton({ enabled, program, startProgram }: { enabled: boolean | null, program: RGBLightsProgramT, startProgram: (program: RGBLightsProgramT) => void }) {
    return (
        <>
            {enabled ? (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => startProgram(program)}
                >
                    <div
                        style={{
                            background: `linear-gradient(
                                90deg,
                                rgba(255, 0, 0, 1) 10%,
                                rgba(255, 154, 0, 1) 20%,
                                rgba(208, 222, 33, 1) 30%,
                                rgba(79, 220, 74, 1) 40%,
                                rgba(63, 218, 216, 1) 50%,
                                rgba(47, 201, 226, 1) 60%,
                                rgba(28, 127, 238, 1) 70%,
                                rgba(95, 21, 242, 1) 80%,
                                rgba(186, 12, 248, 1) 90%,
                                rgba(251, 7, 217, 1) 100%
                            )`
                        }}
                        className="border border-fg-dark p-2 rounded"
                    />
                </motion.button>
            ) : (
                <div
                    className="p-2 rounded bg-bg-light"
                />
            )}
        </>
    )
}


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

    if (!loading && !state) {
        return (
            <p>Something went wrong!</p>
        )
    }

    const ready = state && !loading;

    return (
        <div
            className="bg-bg-dark rounded w-64"
            style={{ boxShadow: ready ? (`0 0 30px 1px rgb(${state.r}, ${state.g}, ${state.b})`) : `` }}
        >
            <div className="h-20">
                <div className="p-2 h-full grid grid-cols-[1fr_3fr] items-center">
                    <div className="flex justify-center">
                        {ready ? (
                            <motion.button
                                className={`${state.powered ? 'bg-bg-accent' : 'bg-bg-light'} rounded-full p-3`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={togglePower}
                            >
                                <Power width={30} height={30} className={`${state.powered ? 'text-fg-accent' : 'text-fg-light'}`} />
                            </motion.button>
                        ) : (
                            <div className="bg-bg-light rounded-full p-3 w-fit h-fit">
                                <LoadingSpinnerImage width={30} height={30} />
                            </div>
                        )}
                    </div>
                    <div className="h-full flex flex-col justify-center gap-2">
                        <div className="flex justify-center">
                            <Link href={`/home/${device.deviceId}`}>
                                <h1 className={ready ? `text-fg-dark` : `text-fg-light`}>{device.name}</h1>
                            </Link>
                        </div>
                        <div className="flex justify-center">
                            <div className="flex gap-3 justify-center items-center">
                                <ColorButton enabled={ready} r={255} g={255} b={255} setColor={setColor} />
                                <ColorButton enabled={ready} r={255} g={0} b={0} setColor={setColor} />
                                <ColorButton enabled={ready} r={255} g={0} b={255} setColor={setColor} />
                                <ColorButton enabled={ready} r={0} g={255} b={255} setColor={setColor} />
                                <ProgramButton enabled={ready} program={'rainbowFade'} startProgram={startProgram} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-9 p-3 bg-bg-medium flex justify-center items-center rounded-b">
                {state && !loading && (
                    <motion.p
                        className="text-xs text-fg-medium"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        ONLINE, POWERED {state.powered ? 'ON' : 'OFF'}
                    </motion.p>
                )}
            </div>
        </div>
    )
}
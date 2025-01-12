'use client';

import { DeviceT } from "hc_models/models";
import { Power } from "lucide-react";
import { motion } from "motion/react";

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

export function OnlineDeviceCard({ device }: { device: DeviceT }) {
    return (
        <div className="bg-bg-dark rounded w-64">
            <div className="p-3 flex items-center">
                <motion.button
                    className="bg-bg-light rounded-full p-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                >
                    <Power width={30} height={30} className="text-fg-dark" />
                </motion.button>
                <div className="grow flex justify-center">
                    <h1 className="text-fg-dark">{device.name}</h1>
                </div>
            </div>
            <div className="p-3 bg-bg-medium flex justify-center items-center">
                <p className="text-xs text-fg-medium">ONLINE, POWERED OFF</p>
            </div>
        </div>
    )
}
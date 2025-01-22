'use client';

import { DeviceT } from "hc_models/models";
import { ArrowLeft, Settings } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function Header({ device }: { device: DeviceT }) {
    return (
        <div className="w-full">
            <div className="flex gap-2 items-center">
                <Link href="/home">
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.99 }}
                        className="p-1 rounded hover:bg-bg-dark"
                    >
                        <ArrowLeft width={25} height={25} className="text-fg-medium" />
                    </motion.div>
                </Link>
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl text-fg-medium">{device.name}</h1>
                </div>
                <div className="grow flex justify-end">
                    <motion.div
                        className="bg-bg-medium p-1 rounded"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Settings width={15} height={15} className="text-fg-light" />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
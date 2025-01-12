'use client';

import { ReactNode } from "react";

import ThemeToggle from "@/components/theme_toggle/theme_toggle";
import { GatewayProvider } from "@/contexts/gateway";
import { Lamp, Plus, Settings, Smartphone } from "lucide-react";
import { motion } from "motion/react";
import './css/home.css';

export default function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <div className="animate-fade-in vertical-layout">
            <div className="bg-bg-dark flex justify-between items-center p-4">
                <div className="flex gap-2 items-center">
                    <Lamp width={20} height={20} className="text-fg-medium" />
                    <h1 className="text-fg-medium text-lg">HomeController</h1>
                </div>
                <div>
                    <ThemeToggle />
                </div>
            </div>
            <div className="horizontal-layout">
                <div className="bg-bg-medium p-2">
                    <motion.button
                        className="p-2 w-full rounded flex gap-4 items-center hover:bg-bg-dark"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <Smartphone width={15} height={15} className="text-fg-dark" />
                        <p className="text-sm text-fg-dark">My Devices</p>
                    </motion.button>
                    <motion.button
                        className="p-2 w-full rounded flex gap-4 items-center hover:bg-bg-dark"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <Plus width={15} height={15} className="text-fg-dark" />
                        <p className="text-sm text-fg-dark">Add Device</p>
                    </motion.button>
                    <motion.button
                        className="p-2 w-full rounded flex gap-4 items-center hover:bg-bg-dark"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <Settings width={15} height={15} className="text-fg-dark" />
                        <p className="text-sm text-fg-dark">Settings</p>
                    </motion.button>
                </div>
                <div className="">
                    <GatewayProvider>
                        {children}
                    </GatewayProvider>
                </div>
            </div>
            <div className="pl-2 flex items-center bg-bg-dark">
                <p className="text-xs text-fg-medium">HomeController v4 <span className="text-fg-dark bg-red-600 rounded">Alpha</span> | <a href="https://github.com/josh-dittmer/HomeController_v4" className="underline">GitHub</a></p>
            </div>
        </div >
    )
}
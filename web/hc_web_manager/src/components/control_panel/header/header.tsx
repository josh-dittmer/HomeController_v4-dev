'use client';

import { DeviceT } from "hc_models/models";
import { MaxDeviceDescriptionLength, MaxDeviceNameLength } from "hc_models/values";
import { ArrowLeft, Pencil, Settings, Trash } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

function TextBox({ value, setValue, multiline, maxChars, setValid, title, placeholder }: { value: string, setValue: Dispatch<SetStateAction<string>>, maxChars: number, multiline: boolean, setValid: Dispatch<SetStateAction<boolean | undefined>>, title: string, placeholder: string }) {
    const isValid = useCallback((value: string) => value.length >= 0 && value.length <= maxChars, [maxChars]);

    useEffect(() => {
        setValid(isValid(value));
    }, [value, isValid, setValid]);

    return (
        <div className="flex flex-col gap-1">
            <p className="text-sm text-fg-medium">{title}</p>
            <div className="w-64 p-2 bg-bg-medium flex flex-col">
                <div className="flex items-center gap-2">
                    {!multiline ? (
                        <>
                            <input
                                type="text"
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                placeholder={placeholder}
                                className="bg-transparent outline-none text-sm text-fg-dark grow"
                            />
                        </>
                    ) : (
                        <textarea
                            rows={2}
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            placeholder={placeholder}
                            className="bg-transparent outline-none text-sm text-fg-dark resize-none grow"
                        />
                    )}
                    <p className={`text-xs ${isValid(value) ? 'text-fg-light' : 'text-red-600'}`}>{value.length}/{maxChars}</p>
                </div>
            </div>
        </div>
    )
}

function Button({ title, valid, cn, onClick }: { title: string, valid: boolean | undefined, cn: string, onClick: () => void }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`p-2 rounded text-sm ${valid ? cn : 'text-fg-medium bg-bg-medium'}`}
        >
            {title}
        </motion.button>
    )
}

function EditWindow({ visible, setVisible, device }: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>, device: DeviceT }) {
    const [name, setName] = useState<string>(device.name);
    const [nameValid, setNameValid] = useState<boolean>();

    const [description, setDescription] = useState<string>(device.description);
    const [descriptionValid, setDescriptionValid] = useState<boolean>();

    const valid = nameValid && descriptionValid;

    if (!visible) {
        return;
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                className="fixed top-0 left-0 z-10 w-screen h-screen bg-black"
            />
            <div className="fixed top-0 left-0 z-20 w-screen h-screen flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-bg-light rounded p-4">
                    <div className="flex items-center gap-4">
                        <Pencil width={20} height={20} className="text-fg-dark" />
                        <h1 className="text-fg-dark text-lg">Edit Device</h1>
                    </div>
                    <div className="mt-4">
                        <TextBox value={name} setValue={setName} maxChars={MaxDeviceNameLength} multiline={false} setValid={setNameValid} title="Device Name" placeholder="Device name..." />
                    </div>
                    <div className="mt-4">
                        <TextBox value={description} setValue={setDescription} maxChars={MaxDeviceDescriptionLength} multiline={true} setValid={setDescriptionValid} title="Device Description" placeholder="Device description..." />
                    </div>
                    <div className="mt-4">
                        <div className="flex gap-2 justify-end">
                            <Button title="Cancel" valid={true} cn="bg-bg-medium text-fg-accent" onClick={() => {
                                setVisible(false);
                                setName(device.name);
                                setDescription(device.description);
                            }} />
                            <Button title="Save" valid={valid} cn="bg-bg-accent text-fg-accent" onClick={() => 1} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

function Menu({ visible, setVisible, editWindowVisible, setEditWindowVisible }: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>, editWindowVisible: boolean, setEditWindowVisible: Dispatch<SetStateAction<boolean>> }) {
    if (!visible) {
        return;
    }

    return (
        <motion.div
            initial={{ opacity: 0, transform: 'translateY(-10px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            className="absolute right-0"
        >
            <div className="mt-2 p-3 bg-bg-dark rounded-xl flex flex-col gap-4">
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                        setVisible(false);
                        setEditWindowVisible(true);
                    }}
                >
                    <div className="gap-4 flex items-center text-left text-nowrap">
                        <p className="grow text-fg-dark text-sm">Edit Device</p>
                        <Pencil width={13} height={13} className="text-fg-dark" />
                    </div>
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                >
                    <div className="gap-4 flex items-center text-nowrap">
                        <p className="grow text-red-600 text-sm">Delete Device</p>
                        <Trash width={13} height={13} className="text-red-600" />
                    </div>
                </motion.button>
            </div>
        </motion.div>
    )
}

export default function Header({ device }: { device: DeviceT }) {
    const [menuVisible, setMenuVisible] = useState<boolean>(false);
    const [editWindowVisible, setEditWindowVisible] = useState<boolean>(false);

    return (
        <div className="w-full h-10 flex items-center">
            <div className="w-full flex gap-2 items-center">
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
                    <div className="relative">
                        <motion.button
                            className="bg-bg-medium p-1 rounded"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMenuVisible(!menuVisible)}
                        >
                            <Settings width={15} height={15} className="text-fg-light" />
                        </motion.button>
                        <Menu visible={menuVisible} setVisible={setMenuVisible} editWindowVisible={editWindowVisible} setEditWindowVisible={setEditWindowVisible} />
                        <EditWindow visible={editWindowVisible} setVisible={setEditWindowVisible} device={device} />
                    </div>
                </div>
            </div>
        </div>
    )
}
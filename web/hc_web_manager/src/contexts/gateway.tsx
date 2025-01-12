import { getTicket } from "@/lib/api/actions";
import { Endpoints } from "@/lib/api/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

type SendFunc = () => void;
type CallbackFunc = () => void;
type SubscribeFunc = (channel: string, callback: CallbackFunc) => void;
type UnsubscribeFunc = (channel: string) => void;

type GatewayContextType = {
    send: SendFunc,
    subscribe: SubscribeFunc,
    unsubscribe: UnsubscribeFunc
};

export const GatewayContext = createContext<GatewayContextType | null>(null);

export function GatewayProvider({ children }: { children: ReactNode }) {
    const client = useQueryClient();

    const socketInst = useRef<Socket | null>(null);
    const channels = useRef(new Map<string, CallbackFunc>());

    const send: SendFunc = () => {
        console.log('test send');
    };

    const subscribe: SubscribeFunc = (channel: string, callback: CallbackFunc) => {
        channels.current.set(channel, callback);
    };

    const unsubscribe: UnsubscribeFunc = (channel: string) => {
        channels.current.delete(channel);
    };

    useEffect(() => {
        socketInst.current = io(Endpoints.mainApiUrl, {
            path: `${Endpoints.mainApiPrefix}/gateway`,
            auth: async (cb) => {
                const res = await getTicket();
                cb({
                    type: 'user',
                    key: res.ticket
                })
            }
        });

        socketInst.current.on('connect_error', (err) => {
            console.log(`GATEWAY CONNECTION ERROR: ${err}`);
            socketInst.current?.disconnect();
        });

        return () => {
            socketInst.current?.disconnect();
        }
    }, [client]);

    return (
        <GatewayContext.Provider value={{ send: send, subscribe: subscribe, unsubscribe: unsubscribe }}>
            {children}
        </GatewayContext.Provider>
    )
}
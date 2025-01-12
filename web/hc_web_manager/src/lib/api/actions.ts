'use server';

import { isLeft } from 'fp-ts/lib/Either';
import { GetAllDevicesResponse, GetAllDevicesResponseT, TicketResponse, TicketResponseT } from "hc_models/models";
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/PathReporter';
import { redirect } from "next/navigation";
import { getAccessToken } from "../auth/actions";
import { Endpoints } from "./endpoints";
import { getReq } from './util';

export async function request(url: string, data: RequestInit, useAuth: boolean): Promise<Response> {
    if (useAuth) {
        try {
            const accessToken = await getAccessToken();

            data.headers = new Headers(data.headers);
            data.headers.set('Authorization', `Bearer ${accessToken}`);
        } catch {
            redirect('/login');
        }
    }

    const response = await fetch(url, data);

    if (response.status === 401) {
        redirect('/login');
    } else if (response.status !== 200) {
        throw new Error('request failed');
    }

    return response;
}

export async function requestAndDecode<C extends t.Mixed>(path: string, data: RequestInit, decoder: C): Promise<t.TypeOf<typeof decoder>> {
    const response = await request(`${Endpoints.mainApi}${path}`, data, true);
    const parsed: unknown = await response.json();

    const decoded = decoder.decode(parsed);
    if (isLeft(decoded)) {
        throw new Error(`could not validate data: ${PathReporter.report(decoded).join('\n')}`);
    }

    return decoded.right;
}

export async function getAllDevices(): Promise<GetAllDevicesResponseT> {
    //await new Promise((resolve) => setTimeout(resolve, 5000));
    return await requestAndDecode('/device/all', getReq(), GetAllDevicesResponse);
}

export async function getTicket(): Promise<TicketResponseT> {
    return await requestAndDecode('/ticket', getReq(), TicketResponse);
}
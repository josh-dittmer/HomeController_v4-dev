import { NextRequest, NextResponse } from "next/server";
import { refreshIfExpired } from "./lib/auth/actions";

// automatically refresh token when expired
export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    await refreshIfExpired(req, res);

    return res;
}

export const config = {
    matcher: ['/home', '/home/(.*)']
};
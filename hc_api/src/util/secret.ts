import bcrypt from 'bcryptjs';
import { TicketNumBytes } from 'hc_models/values';
import { randomBytes } from 'node:crypto';

export function generateDeviceSecret(): string {
    return '';
}

export function generateUserTicket(): string {
    const bytes = randomBytes(TicketNumBytes);
    return bytes.toString('hex');
}

export async function hashSecret(secret: string): Promise<string> {
    return await bcrypt.hash(secret, 16);
}

export async function verifySecret(secret: string, secretHash: string): Promise<boolean> {
    return await bcrypt.compare(secret, secretHash);
}
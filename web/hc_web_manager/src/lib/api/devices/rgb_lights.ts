import { isLeft } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

export const RGBLightsState = t.type({
    powered: t.boolean,
    program: t.string,
    r: t.number,
    g: t.number,
    b: t.number
});

export type RGBLightsStateT = t.TypeOf<typeof RGBLightsState>;

export function stateDecode(data: object): RGBLightsStateT {
    const decoded = RGBLightsState.decode(data);
    if (isLeft(decoded)) {
        throw new Error('invalid data provided for RGBLights state decode');
    }

    return decoded.right;
}

export const Commands = {
    powerOn: () => ({
        command: 'powerOn'
    }),
    powerOff: () => ({
        command: 'powerOff'
    })
}
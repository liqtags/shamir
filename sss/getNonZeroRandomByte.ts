import { getRandomByte } from './getRandomByte';

export function getNonZeroRandomByte(): number {
    while (true) {
        const byte = getRandomByte();
        if (byte > 0) {
            return byte;
        }
    }
}

import { getRandomBytes } from './getRandomBytes';

export function getRandomByte(): number {
    return getRandomBytes(1)[0]!;
}

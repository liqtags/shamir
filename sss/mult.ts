import { LOG_TABLE } from './LOG_TABLE';
import { EXP_TABLE } from './EXP_TABLE';

// Multiplies two numbers in GF(2^8).
export function mult(a: number, b: number): number {
    if (!Number.isInteger(a) || a < 0 || a > 255) {
        throw new RangeError('Number is out of Uint8 range');
    }
    if (!Number.isInteger(b) || b < 0 || b > 255) {
        throw new RangeError('Number is out of Uint8 range');
    }
    const logA = LOG_TABLE[a]!;
    const logB = LOG_TABLE[b]!;
    const sum = (logA + logB) % 255;
    const result = EXP_TABLE[sum]!;

    return a === 0 || b === 0 ? 0 : result;
}

import { LOG_TABLE } from './LOG_TABLE';
import { EXP_TABLE } from './EXP_TABLE';

// Divides two numbers in GF(2^8).
export function div(a: number, b: number): number {
    if (!Number.isInteger(a) || a < 0 || a > 255) {
        throw new RangeError('Number is out of Uint8 range');
    }
    if (!Number.isInteger(b) || b < 0 || b > 255) {
        throw new RangeError('Number is out of Uint8 range');
    }
    // This should never happen
    if (b === 0) {
        throw new Error('cannot divide by zero');
    }

    const logA = LOG_TABLE[a]!;
    const logB = LOG_TABLE[b]!;
    const diff = (logA - logB + 255) % 255;
    const result = EXP_TABLE[diff]!;

    return a === 0 ? 0 : result;
}

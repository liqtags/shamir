// Combines two numbers in GF(2^8).
// This can be used for both addition and subtraction.
export function add(a: number, b: number): number {
    if (!Number.isInteger(a) || a < 0 || a > 255) {
        throw new RangeError('Number is out of Uint8 range');
    }
    if (!Number.isInteger(b) || b < 0 || b > 255) {
        throw new RangeError('Number is out of Uint8 range');
    }
    return a ^ b;
}

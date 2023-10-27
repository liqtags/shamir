import { evaluate } from "./evaluate";
import { newCoefficients } from "./newCoefficients";
import { newCoordinates } from "./newCoordinates";
import { AssertArgument } from "./AssertArgument";

/**
 * Splits a `secret` into `shares` number of shares, requiring `threshold` of them to reconstruct `secret`.
 *
 * @param secret The secret value to split into shares.
 * @param shares The total number of shares to split `secret` into. Must be at least 2 and at most 255.
 * @param threshold The minimum number of shares required to reconstruct `secret`. Must be at least 2 and at most 255.
 * @returns A list of `shares` shares.
 */

export async function split(
    secret: Uint8Array,
    shares: number,
    threshold: number
): Promise<Uint8Array[]> {
    // secret must be a non-empty Uint8Array
    AssertArgument.instanceOf(secret, Uint8Array, 'secret must be a Uint8Array');
    AssertArgument.greaterThanOrEqualTo(secret.byteLength, 1, 'secret cannot be empty');

    // shares must be a number in the range [2, 256)
    AssertArgument.instanceOf(shares, Number, 'shares must be a number');
    AssertArgument.inRange(shares, 2, 256, 'shares must be at least 2 and at most 255');

    // threshold must be a number in the range [2, 256)
    AssertArgument.instanceOf(threshold, Number, 'threshold must be a number');
    AssertArgument.inRange(threshold, 2, 256, 'threshold must be at least 2 and at most 255');

    // total number of shares must be greater than or equal to the required threshold
    AssertArgument.greaterThanOrEqualTo(shares, threshold, 'shares cannot be less than threshold');

    const result: Uint8Array[] = [];
    const secretLength = secret.byteLength;
    const xCoordinates = newCoordinates();

    for (let i = 0; i < shares; i++) {
        const share = new Uint8Array(secretLength + 1);
        share[secretLength] = xCoordinates[i]!;
        result.push(share);
    }

    const degree = threshold - 1;

    for (let i = 0; i < secretLength; i++) {
        const byte = secret[i]!;
        const coefficients = newCoefficients(byte, degree);

        for (let j = 0; j < shares; ++j) {
            const x = xCoordinates[j]!;
            const y = evaluate(coefficients, x, degree);
            result[j]![i] = y;
        }
    }

    return result;
}

import { interpolatePolynomial } from './interpolatePolynomial';
import { AssertArgument } from './AssertArgument';

/**
 * Combines `shares` to reconstruct the secret.
 *
 * @param shares A list of shares to reconstruct the secret from. Must be at least 2 and at most 255.
 * @returns The reconstructed secret.
 */

export async function combine(shares: Uint8Array[]): Promise<Uint8Array> {
    // Shares must be an array with length in the range [2, 256)
    AssertArgument.instanceOf(shares, Array, 'shares must be an Array');
    AssertArgument.inRange(
        shares.length,
        2,
        256,
        'shares must have at least 2 and at most 255 elements'
    );

    // Shares must be a Uint8Array with at least 2 bytes and all shares must have the same byte length.
    const share1 = shares[0]!;
    AssertArgument.instanceOf(share1, Uint8Array, 'each share must be a Uint8Array');
    for (const share of shares) {
        AssertArgument.instanceOf(share, Uint8Array, 'each share must be a Uint8Array');
        AssertArgument.greaterThanOrEqualTo(share.byteLength, 2, 'each share must be at least 2 bytes');
        AssertArgument.equalTo(
            share.byteLength,
            share1.byteLength,
            'all shares must have the same byte length'
        );
    }

    const sharesLength = shares.length;
    const shareLength = share1.byteLength;

    // This will be our reconstructed secret
    const secretLength = shareLength - 1;
    const secret = new Uint8Array(secretLength);

    const xSamples = new Uint8Array(sharesLength);
    const ySamples = new Uint8Array(sharesLength);

    const samples: Set<number> = new Set();
    for (let i = 0; i < sharesLength; i++) {
        const share = shares[i]!;
        const sample = share[shareLength - 1]!;

        // The last byte of each share should be a unique value between 1-255 inclusive.
        if (samples.has(sample)) {
            throw new Error('shares must contain unique values but a duplicate was found');
        }

        samples.add(sample);
        xSamples[i] = sample;
    }

    // Reconstruct each byte
    for (let i = 0; i < secretLength; i++) {
        // Set the y value for each sample
        for (let j = 0; j < sharesLength; ++j) {
            ySamples[j] = shares[j]![i]!;
        }

        // Interpolate the polynomial and compute the value at 0
        secret[i] = interpolatePolynomial(xSamples, ySamples, 0);
    }

    return secret;
}

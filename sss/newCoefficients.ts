import { getRandomByte } from './getRandomByte';
import { getNonZeroRandomByte } from './getNonZeroRandomByte';

// Creates a pseudo-random set of coefficients for a polynomial.
export function newCoefficients(intercept: number, degree: number): Readonly<Uint8Array> {
    const coefficients = new Uint8Array(degree + 1);

    // The first byte is always the intercept
    coefficients[0] = intercept;

    for (let i = 1; i <= degree; i++) {
        // degree is equal to t-1, where t is the threshold of required shares.
        // The coefficient at t-1 cannot equal 0.
        const coefficientTMinus1 = i === degree;
        coefficients[i] = coefficientTMinus1 ? getNonZeroRandomByte() : getRandomByte();
    }

    return coefficients;
}

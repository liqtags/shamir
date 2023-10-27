import { add } from './add';
import { div } from './div';
import { mult } from './mult';

// Takes N sample points and returns the value at a given x using a lagrange interpolation.
export function interpolatePolynomial(xSamples: Uint8Array, ySamples: Uint8Array, x: number): number {
    if (xSamples.length !== ySamples.length) {
        throw new Error('sample length mistmatch');
    }

    const limit = xSamples.length;

    let basis = 0;
    let result = 0;

    for (let i = 0; i < limit; i++) {
        basis = 1;

        for (let j = 0; j < limit; ++j) {
            if (i === j) {
                continue;
            }
            const num = add(x, xSamples[j]!);
            const denom = add(xSamples[i]!, xSamples[j]!);
            const term = div(num, denom);
            basis = mult(basis, term);
        }

        result = add(result, mult(ySamples[i]!, basis));
    }

    return result;
}

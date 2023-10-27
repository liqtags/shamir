import { add } from './add';
import { mult } from './mult';

// Evaluates a polynomial with the given x using Horner's method.
export function evaluate(coefficients: Uint8Array, x: number, degree: number) {
    if (x === 0) {
        throw new Error('cannot evaluate secret polynomial at zero');
    }

    let result = coefficients[degree]!;

    for (let i = degree - 1; i >= 0; i--) {
        const coefficient = coefficients[i]!;
        result = add(mult(result, x), coefficient);
    }

    return result;
}

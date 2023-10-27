// Helpers for declarative argument validation.
export const AssertArgument = {
    instanceOf(object: any, constructor: Function, message: string) {
        if (object.constructor !== constructor) {
            throw new TypeError(message);
        }
    },

    inRange(n: number, start: number, until: number, message: string) {
        if (!(start < until && n >= start && n < until)) {
            throw new RangeError(message);
        }
    },

    greaterThanOrEqualTo(a: number, b: number, message: string) {
        if (a < b) {
            throw new Error(message);
        }
    },

    equalTo(a: any, b: any, message: string) {
        if (a !== b) {
            throw new Error(message);
        }
    },
};

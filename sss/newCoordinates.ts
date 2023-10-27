import { getRandomBytes } from './getRandomBytes';

// Creates a set of values from [1, 256).
// Returns a psuedo-random shuffling of the set.
export function newCoordinates(): Readonly<Uint8Array> {
    const coordinates = new Uint8Array(255);
    for (let i = 0; i < 255; i++) {
        coordinates[i] = i + 1;
    }

    // Pseudo-randomize the array of coordinates.
    //
    // This impl maps almost perfectly because both of the lists (coordinates and randomIndices)
    // have a length of 255 and byte values are between 0 and 255 inclusive. The only value that
    // does not map neatly here is if the random byte is 255, since that value used as an index
    // would be out of bounds. Thus, for bytes whose value is 255, wrap around to 0.
    const randomIndices = getRandomBytes(255);
    for (let i = 0; i < 255; i++) {
        const j = randomIndices[i]! % 255; // Make sure to handle the case where the byte is 255.
        const temp = coordinates[i]!;
        coordinates[i] = coordinates[j]!;
        coordinates[j] = temp;
    }

    return coordinates;
}

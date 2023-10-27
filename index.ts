import { splitWithPasswordToFile } from './splitWithPasswordToFile';
import { combineShares } from './combineShares';

const main = async () => {
    /**
     * splitWithPasswordToFile
     * This splits the input into shares with a password and writes them to a file
     */
    await splitWithPasswordToFile('gtp2at', 'hello world', 'password', 5, 3);
    /**
     * combineShares
     * This combines the shares from the file and returns the secret
     */
    const combinedShares = await combineShares('gtp2at_shares.json', 'password');
    return combinedShares;
}

main();
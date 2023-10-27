import { decryptAndCombineWithPassword } from './shamir';
import fs from 'fs';

export const combineShares = async (filePath: string, password: string) => {
    const share = JSON.parse(await fs.readFileSync(filePath, 'utf8'));
    const combinedSecret = await decryptAndCombineWithPassword(password, share);
    return combinedSecret;
};

import { splitWithPasswordAsStore } from './shamir';
import fs from 'fs';

export const splitWithPasswordToFile = async (filename: string, input: any, password: any, total: any, threshold: any) => {
    const splitdata = await splitWithPasswordAsStore(input, password, total, threshold);
    return await fs.writeFileSync(`${filename}_shares.json`, JSON.stringify(splitdata, null, 2));
};

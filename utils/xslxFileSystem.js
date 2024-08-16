import { promises as fs } from 'fs';

export const writeFileXlsx = async (base64Info) => {
    await fs.writeFile('redirect-links.xlsx', base64Info, {
        encoding: 'base64'
    });
};

export const deleteFileXlsx = async () => {
    await fs.unlink('redirect-links.xlsx');
};



import fs from 'fs';

export class Colors
{
    static Reset = '\x1b[0m';
    static Bright = '\x1b[1m';
    static Dim = '\x1b[2m';
    static Underscore = '\x1b[4m';
    static Blink = '\x1b[5m';

    static Fg = class
    {
        static Black = '\x1b[30m';
        static Red = '\x1b[31m';
        static Green = '\x1b[32m';
        static Yellow = '\x1b[33m';
        static Blue = '\x1b[34m';
        static Magenta = '\x1b[35m';
        static Cyan = '\x1b[36m';
        static White = '\x1b[37m';
        static Bold = '\x1b[1m';
    }

    static Bg = class
    {
        static Black = '\x1b[40m';
        static Red = '\x1b[41m';
        static Green = '\x1b[42m';
        static Yellow = '\x1b[43m';
        static Blue = '\x1b[44m';
        static Magenta = '\x1b[45m';
        static Cyan = '\x1b[46m';
        static White = '\x1b[47m';
    }
}

// Function to recursively get all files in a directory
export function GetFiles(dir: string): string[]
{
    const files = fs.readdirSync(dir);
    let fileList: string[] = [];

    for (const file of files)
    {
        const path = `${dir}/${file}`;
        if (fs.statSync(path).isDirectory())
        {
            fileList = fileList.concat(GetFiles(path));
        }
        else
        {
            fileList.push(path);
        }
    }

    return fileList;
}

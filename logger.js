import fs from "fs";
export const logger=(req, res, next)=>
{
    const log=`${new Date().toISOString()}| ${req.method}| ${req.url}\n`;
    fs.appendFileSync("logs.txt",log);
    next();
};

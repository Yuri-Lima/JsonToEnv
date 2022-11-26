export type Set_Env = {
    readFileFrom: string;
    saveFileTo: string;
}

export type Options = {
    overWrite_Original_Env?: boolean;
    createJsonFile?: boolean;
    createEnvFile?: boolean;
    log?: boolean;
}
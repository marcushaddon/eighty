declare type Ctx = {
    [_: string]: any;
};
export declare class Logger {
    private ctx;
    constructor(ctx?: {});
    info(msg: string, ctx: Ctx): void;
    error(msg: string, err?: Ctx, ctx?: Ctx): void;
    debug(msg: string, ctx: Ctx): void;
    setCtx(key: string, val: any): void;
    private log;
}
export {};

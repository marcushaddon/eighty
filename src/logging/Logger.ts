type Ctx = { [ _: string ]: any };

export class Logger {
    private ctx: Ctx;
    constructor(ctx = {}) {
        this.ctx = ctx;
    }

    public info(msg: string, ctx: Ctx) {
        this.log('info', msg, ctx);
    }

    public error(msg: string, err?: Ctx, ctx: Ctx = {}) {
        this.log('error', msg, { error: err, ...ctx });
    }

    public debug(msg: string, ctx: Ctx) {
        this.log('debug', msg, ctx);
    }

    public setCtx(key: string, val: any) {
        this.ctx[key] = val;
    }

    private log(
        level: 'info' | 'error' | 'debug',
        msg: string,
        ctx: Ctx = {}
    ) {
        console[level]({
            message: msg,
            createdAt: new Date().toISOString(),
            ...this.ctx,
            ...ctx, level
        });
    }
}
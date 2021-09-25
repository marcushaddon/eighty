import * as rt from 'runtypes';
export declare const DatabaseValidator: rt.Record<{
    type: rt.Union<[rt.Literal<"mock">, rt.Literal<"mongodb">]>;
}, false>;
export declare type Database = rt.Static<typeof DatabaseValidator>;
export declare type EightyRecord = {
    id: string;
    createdBy?: string;
};

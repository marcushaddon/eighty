import * as rt from 'runtypes';

export const DatabaseValidator = rt.Record({
    type: rt.Union(
        rt.Literal('mock'),
        rt.Literal('mongodb'),
    ),
});

export type Database = rt.Static<typeof DatabaseValidator>;

export type EightyRecord = {
    id: string,
    createdBy?: string;
}

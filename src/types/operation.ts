import * as rt from 'runtypes';
import { Unknown } from 'runtypes';

export const OperationNameValidator = rt.Union(
    rt.Literal('list'),
    rt.Literal('getOne'),
    rt.Literal('create'),
    rt.Literal('createOrReplace'),
    rt.Literal('replace'),
    rt.Literal('update'),
    rt.Literal('delete'),
);

export type OperationName = rt.Static<typeof OperationNameValidator>;

export const UnknownFieldsPolicyValidator = rt.Union(
    rt.Literal('reject'),
    rt.Literal('allow'),
);

export type UnknownFieldsPolicy = rt.Static<typeof UnknownFieldsPolicyValidator>;

export const OperationValidator = rt.Record({
    authentication: rt.Optional(rt.Boolean),
    unknownFieldsPolicy: rt.Optional(UnknownFieldsPolicyValidator)
});

export type Operation = rt.Static<typeof OperationValidator>;

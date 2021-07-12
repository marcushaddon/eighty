import * as rt from 'runtypes';
import { AuthorizationSchemaValidator } from './authorization';

export const OperationNameValidator = rt.Union(
    rt.Literal('list'),
    rt.Literal('getOne'),
    rt.Literal('create'),
    // rt.Literal('createOrReplace'),
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

// TODO: Maybe need to manully handle illogical cominations of authentication + authorization
// Idea: instead of making them optional, make them union of their type | boolean
// and force them to opt out by supplying false!!
export const OperationValidator = rt.Record({
    authentication: rt.Optional(rt.Boolean),
    authorization: rt.Optional(AuthorizationSchemaValidator),
    unknownFieldsPolicy: rt.Optional(UnknownFieldsPolicyValidator)
});

export type Operation = rt.Static<typeof OperationValidator>;

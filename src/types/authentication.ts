import * as rt from 'runtypes';

export const AuthenticationValidator = rt.Record({});

export type Authentication = rt.Static<typeof AuthenticationValidator>;

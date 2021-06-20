import * as rt from 'runtypes';
import { ResourceValidator } from './resource';
import { AuthenticationValidator } from './authentication';

export const EightySchemaValidator = rt.Record({
    version: rt.String,
    // authentication: rt.Optional(AuthenticationValidator),
    resources: rt.Array(ResourceValidator),
});

export type EightySchema = rt.Static<typeof EightySchemaValidator>;

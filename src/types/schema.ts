import * as rt from 'runtypes';
import { ResourceValidator } from './resource';
import { AuthenticationValidator } from './authentication';
import { DatabaseValidator } from './database';

export const EightySchemaValidator = rt.Record({
    version: rt.String,
    // authentication: rt.Optional(AuthenticationValidator),
    database: DatabaseValidator,
    resources: rt.Array(ResourceValidator),
});

export type EightySchema = rt.Static<typeof EightySchemaValidator>;

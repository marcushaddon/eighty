# TODO

- Respect `unknownFields` policy for all relevant ops (create, update, replace, and list (filters))
- xxxMake all ops 'opt in' rather than opt out (will need to update test schemas in all test suites)
- xxxImplement authorization (just start writing types and see where it goes)
- xxxsort fields for `list` op!!!
- Add run time logging!
- Improve build time logging
- Update buildPatchValidator to actually just build JSON Schema from base JSON schema
- see what happens when schemas contain array types (most likely to break list + patch)
- xCreate eightySchema to OpenAPI builder (serve it at configurable docs route, but also expose generated docs in return from eighty so they can be merged with bespoke api docs. also expose this builder at root of package so it can be used to create 'live' demo in browser)
- Fail eighty schema validation on unknown fields
- [in] notation for filtering on id fields is broken
- create `listAssumptions(schema)` method to display assumptions API makes about given database, env vars, auth endpoints, etc
- implement Postgres
- implement using TS classes, types, or interfaces as schemas
- create 'hooks' or 'plugins' for each op, first just a post-op hook, then maybe a pre-op? but that could be dangerous (build should fail if resource or op doesnt exist)
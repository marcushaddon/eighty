# TODO

- Respect `unknownFields` policy for all relevant ops (create, update, replace, and list (filters))
- Make all ops 'opt in' rather than opt out (will need to update test schemas in all test suites)
- Implement authorization (just start writing types and see where it goes)
- Add run time logging!
- Improve build time logging
- Update buildPatchValidator to actually just build JSON Schema from base JSON schema
- see what happens when schemas contain array types (most likely to break list + patch)
- Create eightySchema to OpenAPI builder (serve it at configurable docs route, but also expose generated docs in return from eighty so they can be merged with bespoke api docs. also expose this builder at root of package so it can be used to create 'live' demo in browser)
- Fail eighty schema validation on unknown fields
- [in] notation for filtering on id fields is broken
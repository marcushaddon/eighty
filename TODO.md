# TODO

- make all ops attach result to res and call next, have single middleware that just sends response (finisherMW)
- when building routes, check for plugins and place between opMW and finisherMW



- Respect `unknownFields` policy for all relevant ops (create, update, replace, and list (filters))
- see what happens when schemas contain array types (most likely to break list + patch)
- xCreate eightySchema to OpenAPI builder (serve it at configurable docs route, but also expose generated docs in return from eighty so they can be merged with bespoke api docs. also expose this builder at root of package so it can be used to create 'live' demo in browser)
- Fail eighty schema validation on unknown fields
- [in] notation for filtering on id fields is broken
- implement Postgres

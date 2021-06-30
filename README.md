# eighty
Progressive framework for declaratively building boilerplate CRUD JSON APIs.

## TODO: 
1. Implement pagination return values xxx
1. Create mock auth endpoints xxx
2. Create auth tests for get/list/create xxx
3. Map JSONPatch ops to mongo ops (need to accept optional existing resource)
    - add -> $set
    - remove -> $unset
    - replace -> $set (if queried document has field)
    - copy -> $set(fromPath, toPath)
    - test -> not supported
4. Create OpenAPI Docs builder that can be served from route or merge with other docs
5. Add logging (traceIds, segmentIds)
6. Edge cases:
    - mongo fields that are arrays (and [contains] operator (look up standard for that))
    - regex filters
    - find way to make 'initialized' properties type safe
    - negative pagination params
    - `&field[in]=foo` not working
    - should just log error and ignore unknown filter fields
    - instead of exposing `init` method, just handle inittedness in DbClients


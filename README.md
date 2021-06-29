# eighty
Progressive framework for declaratively building boilerplate CRUD JSON APIs.

## TODO: 
1. Implement pagination return values
1. Create mock auth endpoints
2. Create auth tests for get/list/create
3. Implement replace, update, createOrUpdate, and delete endpoints
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


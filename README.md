# eighty
Progressive framework for declaratively building boilerplate CRUD JSON APIs.

## TODO: 
6. Make filters on list respect unknown fields policy
7. Make create op respect unknown fields policy
4. Revisit update tests
6. Implement replace
7. Implement delete
8. Implement authorization model, create tests 
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


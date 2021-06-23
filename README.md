# eighty
Progressive framework for declaratively building boilerplate CRUD JSON APIs.

## TODO: 
2. Figure out how to make sure tests dont overwrite real DB
3. Make routes and resource names just match
4. Implement list filter parsing overall, translation for each client
    - need to parse query filters (including exists, regex, lt, gte, exists) (look at `qs`)
    - need to translate all filters to mongo query fields and SQL clauses
4. Create all operations for base entities (without relations)
    - for all authentication/authorization levels
5. Decide on postgres/mongo opinions for related entities/self relationships
6. Create all operations for related objects one level deep
7. Create getMany, create for related resources (resource/:id/related)

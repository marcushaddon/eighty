# eighty
Progressive framework for declaratively building boilerplate CRUD JSON APIs.

## TODO: 
1. Create postgres/mongo docker image for integration testing
2. Create fixtures
3. Set up tests to run against mock, postgres, and mongo based on flags?
4. Implement list filter parsing overall, translation for each client
4. Create all operations for base entities (without relations)
    - for all authentication/authorization levels
5. Decide on postgres/mongo opinions for related entities/self relationships
6. Create all operations for related objects one level deep
7. Create getMany, create for related resources (resource/:id/related)

import * as rt from 'runtypes';

export const GroupAuthorizationValidator = rt.Record({
    type: rt.Literal("inGroup"),
    group: rt.String
});
export type GroupAuthorization = rt.Static<typeof GroupAuthorizationValidator>;

export const RoleAuthorizationValidator = rt.Record({
    type: rt.Literal("hasRole"),
    role: rt.String
});
export type RoleAuthorization = rt.Static<typeof RoleAuthorizationValidator>;

export const IdentityAuthorizationValidator = rt.Record({ 
    type: rt.Literal("isResource")
});
export type IdentityAuthorization = rt.Static<typeof IdentityAuthorizationValidator>;

export const OwnershipAuthorizationValidator = rt.Record({
    type: rt.Literal("isOwner"),
    ownerField: rt.Optional(rt.String),
});
export type OwnershipAuthorization = rt.Static<typeof OwnershipAuthorizationValidator>;

export const AuthorizationMethodValidator = rt.Union(
    GroupAuthorizationValidator,
    RoleAuthorizationValidator,
    IdentityAuthorizationValidator,
    IdentityAuthorizationValidator,
    OwnershipAuthorizationValidator,
);
export type AuthorizationMethod = rt.Static<typeof AuthorizationMethodValidator>;

// TODO: need to manually enforce that one and only one is present
export const AuthorizationSchemaValidator = rt.Record({
    allOf: rt.Optional(rt.Array(AuthorizationMethodValidator).withConstraint(val => val.length > 0)),
    anyOf: rt.Optional(rt.Array(AuthorizationMethodValidator).withConstraint(val => val.length > 0)),
});
export type AuthorizationSchema = rt.Static<typeof AuthorizationSchemaValidator>;

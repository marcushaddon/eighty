import * as rt from 'runtypes';
export declare const GroupAuthorizationValidator: rt.Record<{
    type: rt.Literal<"inGroup">;
    group: rt.String;
}, false>;
export declare type GroupAuthorization = rt.Static<typeof GroupAuthorizationValidator>;
export declare const RoleAuthorizationValidator: rt.Record<{
    type: rt.Literal<"hasRole">;
    role: rt.String;
}, false>;
export declare type RoleAuthorization = rt.Static<typeof RoleAuthorizationValidator>;
export declare const IdentityAuthorizationValidator: rt.Record<{
    type: rt.Literal<"isResource">;
}, false>;
export declare type IdentityAuthorization = rt.Static<typeof IdentityAuthorizationValidator>;
export declare const OwnershipAuthorizationValidator: rt.Record<{
    type: rt.Literal<"isOwner">;
    ownerField: rt.Optional<rt.String>;
}, false>;
export declare type OwnershipAuthorization = rt.Static<typeof OwnershipAuthorizationValidator>;
export declare const AuthorizationMethodValidator: rt.Union<[rt.Record<{
    type: rt.Literal<"inGroup">;
    group: rt.String;
}, false>, rt.Record<{
    type: rt.Literal<"hasRole">;
    role: rt.String;
}, false>, rt.Record<{
    type: rt.Literal<"isResource">;
}, false>, rt.Record<{
    type: rt.Literal<"isResource">;
}, false>, rt.Record<{
    type: rt.Literal<"isOwner">;
    ownerField: rt.Optional<rt.String>;
}, false>]>;
export declare type AuthorizationMethod = rt.Static<typeof AuthorizationMethodValidator>;
export declare const CustomAuthorizationValidator: rt.Literal<"custom">;
export declare const BuiltinAuthorizationSchemaValidator: rt.Record<{
    allOf: rt.Optional<rt.Constraint<rt.Array<rt.Union<[rt.Record<{
        type: rt.Literal<"inGroup">;
        group: rt.String;
    }, false>, rt.Record<{
        type: rt.Literal<"hasRole">;
        role: rt.String;
    }, false>, rt.Record<{
        type: rt.Literal<"isResource">;
    }, false>, rt.Record<{
        type: rt.Literal<"isResource">;
    }, false>, rt.Record<{
        type: rt.Literal<"isOwner">;
        ownerField: rt.Optional<rt.String>;
    }, false>]>, false>, ({
        type: "inGroup";
        group: string;
    } | {
        type: "hasRole";
        role: string;
    } | {
        type: "isResource";
    } | {
        type: "isOwner";
        ownerField?: string | undefined;
    })[], unknown>>;
    anyOf: rt.Optional<rt.Constraint<rt.Array<rt.Union<[rt.Record<{
        type: rt.Literal<"inGroup">;
        group: rt.String;
    }, false>, rt.Record<{
        type: rt.Literal<"hasRole">;
        role: rt.String;
    }, false>, rt.Record<{
        type: rt.Literal<"isResource">;
    }, false>, rt.Record<{
        type: rt.Literal<"isResource">;
    }, false>, rt.Record<{
        type: rt.Literal<"isOwner">;
        ownerField: rt.Optional<rt.String>;
    }, false>]>, false>, ({
        type: "inGroup";
        group: string;
    } | {
        type: "hasRole";
        role: string;
    } | {
        type: "isResource";
    } | {
        type: "isOwner";
        ownerField?: string | undefined;
    })[], unknown>>;
}, false>;
export declare const AuthorizationSchemaValidator: rt.Union<[rt.Literal<"custom">, rt.Record<{
    allOf: rt.Optional<rt.Constraint<rt.Array<rt.Union<[rt.Record<{
        type: rt.Literal<"inGroup">;
        group: rt.String;
    }, false>, rt.Record<{
        type: rt.Literal<"hasRole">;
        role: rt.String;
    }, false>, rt.Record<{
        type: rt.Literal<"isResource">;
    }, false>, rt.Record<{
        type: rt.Literal<"isResource">;
    }, false>, rt.Record<{
        type: rt.Literal<"isOwner">;
        ownerField: rt.Optional<rt.String>;
    }, false>]>, false>, ({
        type: "inGroup";
        group: string;
    } | {
        type: "hasRole";
        role: string;
    } | {
        type: "isResource";
    } | {
        type: "isOwner";
        ownerField?: string | undefined;
    })[], unknown>>;
    anyOf: rt.Optional<rt.Constraint<rt.Array<rt.Union<[rt.Record<{
        type: rt.Literal<"inGroup">;
        group: rt.String;
    }, false>, rt.Record<{
        type: rt.Literal<"hasRole">;
        role: rt.String;
    }, false>, rt.Record<{
        type: rt.Literal<"isResource">;
    }, false>, rt.Record<{
        type: rt.Literal<"isResource">;
    }, false>, rt.Record<{
        type: rt.Literal<"isOwner">;
        ownerField: rt.Optional<rt.String>;
    }, false>]>, false>, ({
        type: "inGroup";
        group: string;
    } | {
        type: "hasRole";
        role: string;
    } | {
        type: "isResource";
    } | {
        type: "isOwner";
        ownerField?: string | undefined;
    })[], unknown>>;
}, false>]>;
export declare type AuthorizationSchema = rt.Static<typeof AuthorizationSchemaValidator>;

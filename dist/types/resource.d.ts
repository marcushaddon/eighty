import * as rt from 'runtypes';
export declare const ResourceValidator: rt.Record<{
    name: rt.String;
    schemaPath: rt.Optional<rt.String>;
    operations: rt.Optional<rt.Record<{
        list: rt.Optional<rt.Record<{
            authentication: rt.Optional<rt.Boolean>;
            authorization: rt.Optional<rt.Union<[rt.Literal<"custom">, rt.Record<{
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
            }, false>]>>;
            unknownFieldsPolicy: rt.Optional<rt.Union<[rt.Literal<"reject">, rt.Literal<"allow">]>>;
        }, false>>;
        getOne: rt.Optional<rt.Record<{
            authentication: rt.Optional<rt.Boolean>;
            authorization: rt.Optional<rt.Union<[rt.Literal<"custom">, rt.Record<{
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
            }, false>]>>;
            unknownFieldsPolicy: rt.Optional<rt.Union<[rt.Literal<"reject">, rt.Literal<"allow">]>>;
        }, false>>;
        create: rt.Optional<rt.Record<{
            authentication: rt.Optional<rt.Boolean>;
            authorization: rt.Optional<rt.Union<[rt.Literal<"custom">, rt.Record<{
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
            }, false>]>>;
            unknownFieldsPolicy: rt.Optional<rt.Union<[rt.Literal<"reject">, rt.Literal<"allow">]>>;
        }, false>>;
        replace: rt.Optional<rt.Record<{
            authentication: rt.Optional<rt.Boolean>;
            authorization: rt.Optional<rt.Union<[rt.Literal<"custom">, rt.Record<{
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
            }, false>]>>;
            unknownFieldsPolicy: rt.Optional<rt.Union<[rt.Literal<"reject">, rt.Literal<"allow">]>>;
        }, false>>;
        update: rt.Optional<rt.Record<{
            authentication: rt.Optional<rt.Boolean>;
            authorization: rt.Optional<rt.Union<[rt.Literal<"custom">, rt.Record<{
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
            }, false>]>>;
            unknownFieldsPolicy: rt.Optional<rt.Union<[rt.Literal<"reject">, rt.Literal<"allow">]>>;
        }, false>>;
        delete: rt.Optional<rt.Record<{
            authentication: rt.Optional<rt.Boolean>;
            authorization: rt.Optional<rt.Union<[rt.Literal<"custom">, rt.Record<{
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
            }, false>]>>;
            unknownFieldsPolicy: rt.Optional<rt.Union<[rt.Literal<"reject">, rt.Literal<"allow">]>>;
        }, false>>;
    }, false>>;
}, false>;
export declare type Resource = rt.Static<typeof ResourceValidator>;
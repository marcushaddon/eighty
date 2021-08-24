import * as rt from 'runtypes';
export declare const EightySchemaValidator: rt.Record<{
    version: rt.String;
    name: rt.Optional<rt.String>;
    database: rt.Record<{
        type: rt.Union<[rt.Literal<"mock">, rt.Literal<"mongodb">]>;
    }, false>;
    resources: rt.Array<rt.Record<{
        name: rt.String;
        schemaPath: rt.Optional<rt.String>;
        operations: rt.Optional<rt.Record<{
            list: rt.Optional<rt.Record<{
                authentication: rt.Optional<rt.Boolean>;
                authorization: rt.Optional<rt.Record<{
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
                }, false>>;
                unknownFieldsPolicy: rt.Optional<rt.Union<[rt.Literal<"reject">, rt.Literal<"allow">]>>;
            }, false>>;
            getOne: rt.Optional<rt.Record<{
                authentication: rt.Optional<rt.Boolean>;
                authorization: rt.Optional<rt.Record<{
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
                }, false>>;
                unknownFieldsPolicy: rt.Optional<rt.Union<[rt.Literal<"reject">, rt.Literal<"allow">]>>;
            }, false>>;
            create: rt.Optional<rt.Record<{
                authentication: rt.Optional<rt.Boolean>;
                authorization: rt.Optional<rt.Record<{
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
                }, false>>;
                unknownFieldsPolicy: rt.Optional<rt.Union<[rt.Literal<"reject">, rt.Literal<"allow">]>>;
            }, false>>;
            replace: rt.Optional<rt.Record<{
                authentication: rt.Optional<rt.Boolean>;
                authorization: rt.Optional<rt.Record<{
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
                }, false>>;
                unknownFieldsPolicy: rt.Optional<rt.Union<[rt.Literal<"reject">, rt.Literal<"allow">]>>;
            }, false>>;
            update: rt.Optional<rt.Record<{
                authentication: rt.Optional<rt.Boolean>;
                authorization: rt.Optional<rt.Record<{
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
                }, false>>;
                unknownFieldsPolicy: rt.Optional<rt.Union<[rt.Literal<"reject">, rt.Literal<"allow">]>>;
            }, false>>;
            delete: rt.Optional<rt.Record<{
                authentication: rt.Optional<rt.Boolean>;
                authorization: rt.Optional<rt.Record<{
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
                }, false>>;
                unknownFieldsPolicy: rt.Optional<rt.Union<[rt.Literal<"reject">, rt.Literal<"allow">]>>;
            }, false>>;
        }, false>>;
    }, false>, false>;
}, false>;
export declare type EightySchema = rt.Static<typeof EightySchemaValidator>;

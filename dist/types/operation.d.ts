import * as rt from 'runtypes';
export declare const OperationNameValidator: rt.Union<[rt.Literal<"list">, rt.Literal<"getOne">, rt.Literal<"create">, rt.Literal<"replace">, rt.Literal<"update">, rt.Literal<"delete">]>;
export declare type OperationName = rt.Static<typeof OperationNameValidator>;
export declare const UnknownFieldsPolicyValidator: rt.Union<[rt.Literal<"reject">, rt.Literal<"allow">]>;
export declare type UnknownFieldsPolicy = rt.Static<typeof UnknownFieldsPolicyValidator>;
export declare const OperationValidator: rt.Record<{
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
}, false>;
export declare type Operation = rt.Static<typeof OperationValidator>;

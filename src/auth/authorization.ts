import exp from "constants";
import { Handler } from "express";
import { AuthorizationSchema, AuthorizationMethod, GroupAuthorization, RoleAuthorization } from "../types/authorization";
import { EightyRecord } from "../types/database";
import { Resource } from "../types/resource";

type RequestUser = {
    id: string;
    role?: string;
    roles?: string[];
    group?: string;
    groups?: string[];
};

type PreFetchCheck = (user: RequestUser) => Boolean;
type PostFetchCheck = (user: RequestUser, resource: EightyRecord) => Boolean;

type CheckBuilder = (checkConfig: AuthorizationMethod) => { pre?: PreFetchCheck, post?: PostFetchCheck };

const inGroup = (config: AuthorizationMethod) => ({
    pre: (user: RequestUser) => {
        const groupConfig = config as GroupAuthorization;
        const singleGroup = user.group === groupConfig.group;
        const multipleGroups = !!user.groups && user.groups.indexOf(groupConfig.group) > -1;

        return singleGroup || multipleGroups;
    }
});

const hasRole = (config: AuthorizationMethod) => ({
    pre: (user: RequestUser) => {
        const roleConfig = config as RoleAuthorization;

        const singleRole = user.role === roleConfig.role;
        const multipleRoles = !!user.roles && user.roles.indexOf(roleConfig.role) > -1;

        return singleRole || multipleRoles;
    } 
});

const isResource = (config: AuthorizationMethod) => ({
    post: (user: RequestUser, resource: EightyRecord) => user.id === resource.id,
})

const isOwner = (config: AuthorizationMethod) => ({
    post: (user: RequestUser, resource: EightyRecord) => user.id === resource.createdBy
})

const checkBuilders: { [ checkType: string ]: CheckBuilder } = {
    inGroup,
    hasRole,
    isResource,
    isOwner,
};

const and = (prev: Boolean, current: Boolean) => prev && current;
const or = (prev: Boolean, current: Boolean) => prev || current;

type Check = PreFetchCheck | PostFetchCheck;
const explainPass = (
    checks: Check[],
    results: Boolean[],
    mode: 'allOf' | 'anyOf'
): string => {
    return 'TODO';
}

const explainFail = (
    checks: Check[],
    results: Boolean[],
    mode: 'allOf' | 'anyOf'
): string => {
    return 'TODO';
}

export const buildAuthorization = (resource: Resource, config: AuthorizationSchema): Handler => {
    const mode = 'allOf' in config ? 'allOf' : 'anyOf'; // We can assume only one is set

    const checkFuncs = config[mode]!.map(check => checkBuilders[check.type](check));
    const preChecks = checkFuncs.map(({ pre }) => pre).filter((check): check is PreFetchCheck => !!check);
    const postChecks = checkFuncs.map(({ post }) => post).filter((check): check is PostFetchCheck => !!check);

    
    const authorize: Handler = (req, res, next) => {
        if (preChecks.length === 0) {
            const user = (req as any).user;
            const results = preChecks.map(check => check(user));
            const passPreCheck = results.reduce(mode === 'allOf' ? and : or);
            let explaination: string;
            if (passPreCheck) {
                explaination = explainPass(preChecks, results, mode);
            } else {
                explaination = explainFail(preChecks, results, mode);
            }

            console.log(explaination);
            if (!passPreCheck) {
                return res.status(403).send({ message: explaination }).end();
            }
        } 

        if (postChecks.length === 0) {
            next();
        }

        (req as any).authorizer = (user: RequestUser, resource: EightyRecord): Boolean => {
            const results = postChecks.map(check => check(user, resource));
            const passPostCheck = results.reduce(mode === 'allOf' ? and : or);
            let explaination: string;
            if (passPostCheck) {
                explaination = explainPass(postChecks, results, mode);
            } else {
                explaination = explainFail(postChecks, results, mode);
            }

            console.log(explaination);
            return passPostCheck;
        }
    };

    return authorize;
}

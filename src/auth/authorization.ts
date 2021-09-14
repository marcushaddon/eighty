import exp from "constants";
import { Handler } from "express";
import { AuthorizationSchema, AuthorizationMethod, GroupAuthorization, RoleAuthorization } from "../types/authorization";
import { EightyRecord } from "../types/database";
import { Resource } from "../types/resource";
import { AuthorizationError } from "../errors";

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
    pre: function inGroup(user: RequestUser) {
        const groupConfig = config as GroupAuthorization;
        const singleGroup = user.group === groupConfig.group;
        const multipleGroups = !!user.groups && user.groups.indexOf(groupConfig.group) > -1;

        return singleGroup || multipleGroups;
    }
});

const hasRole = (config: AuthorizationMethod) => ({
    pre: function hasRole(user: RequestUser) {
        const roleConfig = config as RoleAuthorization;

        const singleRole = user.role === roleConfig.role;
        const multipleRoles = !!user.roles && user.roles.indexOf(roleConfig.role) > -1;

        return singleRole || multipleRoles;
    } 
});

const isResource = (config: AuthorizationMethod) => ({
    post: function isResource(user: RequestUser, resource: EightyRecord) { return user.id === resource.id },
})

const isOwner = (config: AuthorizationMethod) => ({
    post: function isOwner(user: RequestUser, resource: EightyRecord) { return user.id === resource.createdBy }
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
    const quantifier = mode === 'allOf' ? 'all' : 'one or more';
    let explaination = `Passed ${quantifier} auth checks. Passed: `;

    const passed = checks
        .map(check => `"${check.name}"`)
        .filter((_, i) => results[i])
        .join(', ');

    explaination += passed;

    return explaination;
}

const explainFail = (
    checks: Check[],
    results: Boolean[],
    mode: 'allOf' | 'anyOf'
): string => {
    const quantifier = mode === 'allOf' ? 'all' : 'one or more';
    let explaination = `Failed to pass ${quantifier} auth checks. Failed: `;

    const failed = checks
        .map(check => `"${check.name}"`)
        .filter((_, i) => !results[i])
        .join(', ');

    explaination += failed;

    return explaination;
}

export const buildAuthorization = (resource: Resource, config: AuthorizationSchema): Handler => {
    if (config === "custom") throw new Error('NOT IMPLEMENTED');
    const mode = 'allOf' in config ? 'allOf' : 'anyOf'; // We can assume only one is set

    const checkFuncs = config[mode]!.map(checkConfig => checkBuilders[checkConfig.type](checkConfig));
    const preChecks = checkFuncs.map(({ pre }) => pre).filter((check): check is PreFetchCheck => !!check);
    const postChecks = checkFuncs.map(({ post }) => post).filter((check): check is PostFetchCheck => !!check);
    
    const authorize: Handler = (req, res, next) => {
        if (preChecks.length > 0) {
            const user = (req as any).user;
            const results = preChecks.map(check => check(user));
            const passPreCheck = results.reduce(mode === 'allOf' ? and : or);
            let explaination: string;
            if (passPreCheck) {
                explaination = explainPass(preChecks, results, mode);
            } else {
                explaination = explainFail(preChecks, results, mode);
            }

            if (!passPreCheck) {
                (req as any).logger.error('Request failed authorization check: ' + explaination);
                return res.status(403).send({ message: explaination }).end();
            }
            (req as any).logger.info('Request passed authorization check: ' + explaination);
        } 

        if (postChecks.length === 0) {
            next();
        }

        (req as any).authorizer = (user: RequestUser, resource: EightyRecord) => {
            const results = postChecks.map(check => check(user, resource));
            const passPostCheck = results.reduce(mode === 'allOf' ? and : or);

            let explaination: string;
            if (passPostCheck) {
                explaination = explainPass(postChecks, results, mode);
            } else {
                explaination = explainFail(postChecks, results, mode);
            }
        
            if (!passPostCheck) {
                (req as any).logger.error('Request failed authorization check: ' + explaination);
                throw new AuthorizationError(`Forbidden: ${explaination}`);
            }
        }

        next();
    };

    return authorize;
}

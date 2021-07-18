import { Handler } from 'express';
import { Resource } from "../types/resource";
import { correctTypes } from ".";
import { ValidatorBuilder } from ".";


const filterPageFields = (fields: any) => {
    delete fields['count'];
    delete fields['skip'];
    delete fields['sort'];
    delete fields['order'];

    return fields;
}

export const buildListValidationMiddleware: ValidatorBuilder = (resource: Resource): Handler => {
    // BOOKMARK
    const validateListParams: Handler = (req, res, next) => {
        const queryParams = req.query;
        const {
            count: countParam,
            skip: skipParam,
            sort,
            order
        } = queryParams;
        const count = countParam && parseInt(countParam as string) || 20;
        const skip = skipParam && parseInt(skipParam as string) || 0;
        (req as any).count = count;
        (req as any).skip = skip;
        (req as any).sort = sort;
        (req as any).order = order;

        const filteredFitlers = filterPageFields(queryParams);
        const policy = resource.operations?.list?.unknownFieldsPolicy || 'reject';
        
        try {
            const filtersWithCorrectedTypes = correctTypes(filteredFitlers, resource, policy);
            (req as any).filters = filtersWithCorrectedTypes;
        } catch (e) {
            (req as any).logger.error('Encountered error resolving filter types', e);
            return res.status(e.status || 500)
                .send({ message: e.message || 'Internal server error' })
                .end();
        }

        // TODO: validate filters (ie accept 'in', 'gte', etc but reject 'foo' as invalid and 'contains' as unupported in current version)
        

        next();
    };

    return validateListParams;
}

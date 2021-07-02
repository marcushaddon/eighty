import { Handler } from 'express';
import { Resource } from "../types/resource";
import { correctTypes } from ".";
import { ValidatorBuilder } from ".";


const filterPageFields = (fields: any) => {
    delete fields['count'];
    delete fields['skip'];

    return fields;
}

export const buildListValidationMiddleware: ValidatorBuilder = (resource: Resource): Handler => {
    // BOOKMARK
    const validateListParams: Handler = (req, res, next) => {
        console.log(req.query, 'QUERY');
        const queryParams = req.query;
        const { count: countParam, skip: skipParam } = queryParams;
        const count = countParam && parseInt(countParam as string) || 20;
        const skip = skipParam && parseInt(skipParam as string) || 0;
        (req as any).count = count;
        (req as any).skip = skip;

        const filteredFitlers = filterPageFields(queryParams);
        const policy = resource.operations?.list?.unknownFieldsPolicy || 'reject';
        
        try {
            const filtersWithCorrectedTypes = correctTypes(filteredFitlers, resource, policy);
            (req as any).filters = filtersWithCorrectedTypes;
        } catch (e) {
            return res.status(e.status || 500)
                .send({ message: e.message || 'Internal server error' })
                .end();
        }

        next();
    };

    return validateListParams;
}

import { Handler } from 'express';
import { Resource } from '../types/resource';
import { ValidatorProvider } from "./ValidatorProvider";

// TODO: Make this respect resource.operations.create.unknownFieldsPolicy!
export const buildCreateValidationMiddleware = (resource: Resource): Handler => {
    const validator = ValidatorProvider.getValidator(resource);
    const validate: Handler = (req, res, next) => {
        const result = validator?.validate(req.body, validator.schemas[resource.name]);
        
        if (result?.errors.length) {
            const errReport = result.errors.map(e => `${e.property} ${e.message}`);
            (req as any).logger.error('Request failed validation: ' + errReport);
            return res.status(400)
                .json({
                    message: 'Bad request: ' + errReport
                }).end();
        }
        return next();
    };

    return validate;
}
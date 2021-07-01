import { Handler } from 'express';
import { Resource } from "../types/resource";
import { ValidatorBuilder } from ".";
import { ValidatorProvider } from "./ValidatorProvider";

export const buildListValidator: ValidatorBuilder = (resource: Resource): Handler => {
    // BOOKMARK
}

import { IDBClient } from "../db/db";
import { Resource } from "../types/resource";
import { Handler } from "express";
export declare const buildCreateOp: ({ resource, db }: {
    resource: Resource;
    db: IDBClient;
}) => Handler;

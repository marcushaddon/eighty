import { Handler } from "express";
import { IDBClient } from "../db/db";
import { Resource } from "../types/resource";
export declare const buildGetOneOp: ({ resource, db }: {
    resource: Resource;
    db: IDBClient;
}) => Handler;

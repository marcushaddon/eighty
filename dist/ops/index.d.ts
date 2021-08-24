import { Handler } from 'express';
import { IDBClient } from "../db";
import { Resource } from '../types/resource';
export declare type OpBuilder = (args: {
    resource: Resource;
    db: IDBClient;
}) => Handler;

import { Handler } from 'express';
import { IDBClient } from "../db";
import { Resource } from '../types/resource';

export type OpBuilder = (args: { resource: Resource, db: IDBClient}) => Handler;

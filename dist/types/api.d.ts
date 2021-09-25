import { EightyRecord } from "./database";
export declare type PaginatedResponse = {
    total: number;
    skipped: number;
    results: EightyRecord[];
};

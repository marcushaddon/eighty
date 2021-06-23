import { EightyRecord } from "./database";

export type PaginatedResponse = {
    total: number;
    skipped: number;
    results: EightyRecord[];
}
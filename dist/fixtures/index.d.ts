export declare const users: ({
    name: string;
    age: number;
    score: number;
    config: {
        nickname: string;
    };
    interests: string[];
    role?: undefined;
} | {
    name: string;
    age: number;
    score: number;
    config: {
        nickname: string;
    };
    interests?: undefined;
    role?: undefined;
} | {
    name: string;
    age: number;
    score: number;
    role: string;
    config?: undefined;
    interests?: undefined;
})[];
export declare const books: {
    title: string;
    pages: number;
    author: {
        name: string;
        age: number;
    };
    themes: string[];
}[];
export declare const buildMongoFixtures: () => Promise<{
    users: any[];
    books: any[];
}>;
export declare const cleanupMongoFixtures: () => Promise<void>;

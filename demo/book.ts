export type Book = {
    title: string;
    pages: number;
    author: {
        name: string;
        age: number;
    };
    themes: string[];
    isbn: string;
}
export class FruitDescriptionWhitespaceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FruitDescriptionWhitespaceError';
    }
}
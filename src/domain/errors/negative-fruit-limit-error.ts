export class NegativeFruitLimitError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NegativeFruitLimitError';
    }
}
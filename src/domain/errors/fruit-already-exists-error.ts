export class FruitAlreadyExistsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FruitAlreadyExistsError';
    }
}
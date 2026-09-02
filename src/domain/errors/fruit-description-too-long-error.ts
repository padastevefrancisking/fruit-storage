export class FruitDescriptionTooLongError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FruitDescriptionTooLongError';
    }
}
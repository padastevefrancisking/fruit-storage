import { FruitDescriptionTooLongError, FruitDescriptionWhitespaceError } from '../errors';

export class FruitDescription {
    private static readonly MAX_LENGTH = 30;
    constructor(private readonly value: string) { }

    public static create(value: string): FruitDescription {
        if (value.trim().length > FruitDescription.MAX_LENGTH) {
            throw new FruitDescriptionTooLongError("Fruit description cannot exceed 30 characters.");
        }

        if (value.trim().length === 0) {
            throw new FruitDescriptionWhitespaceError("Fruit description cannot be empty or whitespace.");
        }

        return new FruitDescription(value);
    }

    public toString(): string {
        return this.value;
    }

    public equals(other: FruitDescription): boolean {
        return this.value === other.value;
    }
}
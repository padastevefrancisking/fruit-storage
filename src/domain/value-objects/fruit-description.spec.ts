import { FruitDescription } from "./fruit-description";
import { FruitDescriptionTooLongError, FruitDescriptionWhitespaceError } from "../errors";

describe('FruitDescription Value Object', () => {
    it('should create a FruitDescription with valid length', () => {
        const description = FruitDescription.create('A sweet red fruit');
        expect(description).toBeInstanceOf(FruitDescription);
        expect(description.toString()).toBe('A sweet red fruit');
    });

    it('should throw an error when the description exceeds the maximum length', () => {
        expect(() => FruitDescription.create('A very long description that exceeds the maximum allowed length for a fruit description')).toThrow(FruitDescriptionTooLongError);
    });

    it('should throw an error when the description is empty or contains only whitespace', () => {
        expect(() => FruitDescription.create('')).toThrow(FruitDescriptionWhitespaceError);
        expect(() => FruitDescription.create('   ')).toThrow(FruitDescriptionWhitespaceError);
    });
})
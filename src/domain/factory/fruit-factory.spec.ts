import { Fruit } from '../entities/fruit';
import { FruitDescription } from '../value-objects/fruit-description';
import { FruitFactory } from './fruit-factory';
import { FruitDescriptionTooLongError, FruitDescriptionWhitespaceError, NegativeFruitLimitError } from '../errors';

describe('FruitFactory', () => {
    it('should create a fruit entity with valid parameters', () => {
        const fruit = FruitFactory.createFruit('Apple', 'A sweet red fruit', 100);
        expect(fruit).toBeInstanceOf(Fruit);
        expect(fruit.name).toBe('Apple');
        expect(fruit.description).toBeInstanceOf(FruitDescription);
        expect(fruit.limitOfFruitToBeStored).toBe(100);
    });

    it('should create a valid description for the fruit', () => {
        const fruit = FruitFactory.createFruit('Banana', 'A long yellow fruit', 50);
        expect(fruit.description.toString()).toBe('A long yellow fruit');
        expect(fruit.description).toBeInstanceOf(FruitDescription);
    });

    it('should throw an error when the description is too long', () => {
        expect(() => {
            FruitFactory.createFruit('Orange', 'A very long description that exceeds the maximum allowed length for a fruit description', 100);
        }).toThrow(FruitDescriptionTooLongError);
    });

    it('should throw an error when the fruit limit is negative', () => {
        expect(() => {
            FruitFactory.createFruit('Cherry', 'A small red fruit', -10);
        }).toThrow(NegativeFruitLimitError);
    });

    it('should throw when the description is empty', () => {
        expect(() => {
            FruitFactory.createFruit('Grapes', '', 100);
        }).toThrow(FruitDescriptionWhitespaceError);
    });

    it('should throw when the description is only whitespace', () => {
        expect(() => {
            FruitFactory.createFruit('Mango', '   ', 100);
        }).toThrow(FruitDescriptionWhitespaceError);
    });
});
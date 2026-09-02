import { Fruit } from './fruit';
import { FruitDescription } from '../value-objects/fruit-description';
import { FruitLimitExceededError, FruitDescriptionTooLongError, NegativeFruitLimitError } from '../errors';


describe('Fruit Entity', () => {
    it('should create a fruit entity with valid parameters', () => {
        const description = FruitDescription.create('A sweet red fruit');
        const fruit = new Fruit('Apple', description, 100);
        expect(fruit).toBeInstanceOf(Fruit);
    });

    it('should throw an error when storing more than the limit', () => {
        const description = FruitDescription.create('A yellow fruit');
        const fruit = new Fruit('Banana', description, 50);
        expect(() => fruit.store(60)).toThrow(FruitLimitExceededError);
    });

    it('should throw an error when the description is too long', () => {
        const longDescription = 'A very long description that exceeds the maximum allowed length for a fruit description';
        expect(() => new Fruit('Orange', FruitDescription.create(longDescription), 100)).toThrow(FruitDescriptionTooLongError);
    });

    it('should update the fruit entity with valid parameters', () => {
        const description = FruitDescription.create('A tropical fruit');
        const fruit = new Fruit('Grapes', description, 200);

        const newName : string = 'Grapes';
        const newDescription : FruitDescription = FruitDescription.create('A bunch of juicy fruits');
        const newLimit : number = 250;
        fruit.update(newName, newDescription, newLimit);

        expect(fruit.name).toBe(newName);
        expect(fruit.description).toBe(newDescription);
        expect(fruit.limitOfFruitToBeStored).toBe(newLimit);
        expect(fruit.currentAmount).toBe(0); 
    });

    it('should store the fruit and update the current amount', () => {
        const description = FruitDescription.create('A tropical fruit');
        const fruit = new Fruit('Mango', description, 100);

        fruit.store(30);
        fruit.store(20);
        expect(fruit.currentAmount).toBe(50);
    });

    it('should throw an error when trying to store more than the limit after some amount has already been stored', () => {
        const description = FruitDescription.create('A tropical fruit with spikes');
        const fruit = new Fruit('Pineapple', description, 100);
        fruit.store(80);
        expect(() => fruit.store(30)).toThrow(FruitLimitExceededError);
    });

    it('should allow storing up to the limit', () => {
        const description = FruitDescription.create('A small red fruit');
        const fruit = new Fruit('Strawberry', description, 100);
        fruit.store(50);
        fruit.store(50);
        expect(fruit.currentAmount).toBe(100);
    });

    it('should throw an error when trying to store a negative amount', () => {
        const description = FruitDescription.create('A small blue fruit');
        const fruit = new Fruit('Blueberry', description, 100);
        expect(() => fruit.store(-10)).toThrow(NegativeFruitLimitError);
    });

    it('should throw an error when the fruit limit is negative', () => {
        const description = FruitDescription.create('A small red fruit');
        expect(() => new Fruit('Cherry', description, -10)).toThrow(NegativeFruitLimitError);
    });
})
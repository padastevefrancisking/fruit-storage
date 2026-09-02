import { Fruit } from './fruit';
import { FruitLimitExceededError, FruitDescriptionTooLongError, NegativeFruitLimitError } from '../errors';


describe('Fruit Entity', () => {
    it('should create a fruit entity with valid parameters', () => {
        const fruit = new Fruit('Apple', 'A sweet red fruit', 100);
        expect(fruit).toBeInstanceOf(Fruit);
    });

    it('should throw an error when storing more than the limit', () => {
        const fruit = new Fruit('Banana', 'A yellow fruit', 50);
        expect(() => fruit.store(60)).toThrow(FruitLimitExceededError);
    });

    it('should throw an error when the description is too long', () => {
        expect(() => new Fruit('Orange', 'A very long description that exceeds the maximum allowed length for a fruit description', 100)).toThrow(FruitDescriptionTooLongError);
    });

    it('should update the fruit entity with valid parameters', () => {
        const fruit = new Fruit('Grapes', 'A bunch of small fruits', 200);

        const newName : string = 'Grapes';
        const newDescription : string = 'A bunch of juicy fruits';
        const newLimit : number = 250;
        fruit.update(newName, newDescription, newLimit);

        expect(fruit.name).toBe(newName);
        expect(fruit.description.toString()).toBe(newDescription);
        expect(fruit.limitOfFruitToBeStored).toBe(newLimit);
        expect(fruit.currentAmount).toBe(0); 
    });

    it('should store the fruit and update the current amount', () => {
        const fruit = new Fruit('Mango', 'A tropical fruit', 100);
        fruit.store(30);
        fruit.store(20);
        expect(fruit.currentAmount).toBe(50);
    });

    it('should throw an error when trying to store more than the limit after some amount has already been stored', () => {
        const fruit = new Fruit('Pineapple', 'A tropical fruit with spikes', 100);
        fruit.store(80);
        expect(() => fruit.store(30)).toThrow(FruitLimitExceededError);
    });

    it('should allow storing up to the limit', () => {
        const fruit = new Fruit('Strawberry', 'A small red fruit', 100);
        fruit.store(50);
        fruit.store(50);
        expect(fruit.currentAmount).toBe(100);
    });

    it('should throw an error when trying to store a negative amount', () => {
        const fruit = new Fruit('Blueberry', 'A small blue fruit', 100);
        expect(() => fruit.store(-10)).toThrow(NegativeFruitLimitError);
    });

    it('should throw an error when the fruit limit is negative', () => {
        expect(() => new Fruit('Cherry', 'A small red fruit', -10)).toThrow(NegativeFruitLimitError);
    });
})
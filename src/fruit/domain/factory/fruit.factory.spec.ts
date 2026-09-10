import { FruitFactory } from './fruit.factory';
import { FruitUniquenessService } from '../fruit-uniqueness';
import { Fruit } from '../fruit.entity';

describe('FruitFactory', () => {
    let factory: FruitFactory;
    let mockUniquenessService: jest.Mocked<FruitUniquenessService>;

    beforeEach(() => {
        mockUniquenessService = {
            isUnique: jest.fn(),
        } as any;
        factory = new FruitFactory(mockUniquenessService);
    });

    it('should successfully create a Fruit when all parameters are valid and name is unique', async () => {
        mockUniquenessService.isUnique.mockResolvedValue(true);

        const result = await factory.create({
            name: 'Orange',
            description: 'Juicy citrus fruit',
            limitOfFruitToBeStored: 80,
        });

        expect(result.isSuccess).toBe(true);
        const fruit = result.getValue();
        expect(fruit).toBeInstanceOf(Fruit);
        expect(fruit.name.value).toBe('Orange');
        expect(fruit.description.value).toBe('Juicy citrus fruit');
        expect(fruit.limitOfFruitToBeStored.value).toBe(80);
        expect(fruit.stock.value).toBe(0);
    });

    it('should fail when name already exists', async () => {
        mockUniquenessService.isUnique.mockResolvedValue(false);

        const result = await factory.create({
            name: 'Apple',
            description: 'Red apple',
            limitOfFruitToBeStored: 50,
        });

        expect(result.isFailure).toBe(true);
        expect(result.getErrorValue()).toContain('already exists');
    });

    it('should fail when description exceeds 30 characters', async () => {
        mockUniquenessService.isUnique.mockResolvedValue(true);

        const result = await factory.create({
            name: 'Banana',
            description: 'A'.repeat(31),
            limitOfFruitToBeStored: 50,
        });

        expect(result.isFailure).toBe(true);
        expect(result.getErrorValue()).toContain('Description exceeded');
    });

    it('should fail when storage limit is negative', async () => {
        mockUniquenessService.isUnique.mockResolvedValue(true);

        const result = await factory.create({
            name: 'Banana',
            description: 'Sweet banana',
            limitOfFruitToBeStored: -10,
        });

        expect(result.isFailure).toBe(true);
    });

    it('should fail when name is empty or whitespace', async () => {
        mockUniquenessService.isUnique.mockResolvedValue(true);

        const result = await factory.create({
            name: '   ',
            description: 'Valid description',
            limitOfFruitToBeStored: 50,
        });

        expect(result.isFailure).toBe(true);
    });
});

import { ListFruitsUseCase } from './list-fruits.use-case';
import { IFruitRepository } from '../../repos/fruit.repository';
import { Fruit } from '../../domain/fruit.entity';
import { FruitName } from '../../domain/value-objects/fruit-name.vo';
import { FruitDescription } from '../../domain/value-objects/fruit-description.vo';
import { FruitStorageLimit } from '../../domain/value-objects/fruit-storage-limit.vo';

describe('ListFruitsUseCase', () => {
    let useCase: ListFruitsUseCase;
    let mockRepo: jest.Mocked<IFruitRepository>;

    beforeEach(() => {
        mockRepo = {
            save: jest.fn(),
            findByName: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
            exists: jest.fn(),
        };
        useCase = new ListFruitsUseCase(mockRepo);
    });

    it('should return a list of all fruit DTOs', async () => {
        const fruit1 = Fruit.create({
            name: FruitName.create('Apple').getValue(),
            description: FruitDescription.create('Red apple').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(100).getValue(),
        }).getValue();

        const fruit2 = Fruit.create({
            name: FruitName.create('Banana').getValue(),
            description: FruitDescription.create('Yellow banana').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(50).getValue(),
        }).getValue();

        mockRepo.findAll.mockResolvedValue([fruit1, fruit2]);

        const result = await useCase.execute();
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Apple');
        expect(result[1].name).toBe('Banana');
    });

    it('should return empty list when no fruits exist', async () => {
        mockRepo.findAll.mockResolvedValue([]);

        const result = await useCase.execute();
        expect(result).toEqual([]);
    });
});

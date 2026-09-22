import { FindFruitUseCase } from './find-fruit.use-case';
import { IFruitRepository } from '../repos/fruit.repository';
import { Fruit } from '../../domain/fruit.entity';
import { FruitName } from '../../domain/value-objects/fruit-name.vo';
import { FruitDescription } from '../../domain/value-objects/fruit-description.vo';
import { FruitStorageLimit } from '../../domain/value-objects/fruit-storage-limit.vo';
import { DomainError } from '../../domain/fruit.errors';

describe('FindFruitUseCase', () => {
    let useCase: FindFruitUseCase;
    let mockRepo: jest.Mocked<IFruitRepository>;

    beforeEach(() => {
        mockRepo = {
            save: jest.fn(),
            findByName: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
            exists: jest.fn(),
        };
        useCase = new FindFruitUseCase(mockRepo);
    });

    it('should return fruit DTO when fruit is found', async () => {
        const fruit = Fruit.create({
            name: FruitName.create('Banana').getValue(),
            description: FruitDescription.create('Yellow banana').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(80).getValue(),
        }).getValue();

        mockRepo.findByName.mockResolvedValue(fruit);

        const result = await useCase.execute({ name: 'Banana' });
        expect(result.name).toBe('Banana');
        expect(result.description).toBe('Yellow banana');
        expect(result.limitOfFruitToBeStored).toBe(80);
    });

    it('should throw DomainError when fruit is not found', async () => {
        mockRepo.findByName.mockResolvedValue(null);

        await expect(useCase.execute({ name: 'Unknown' })).rejects.toThrow(DomainError);
    });
});

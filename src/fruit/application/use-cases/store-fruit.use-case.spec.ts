import { StoreFruitUseCase } from './store-fruit.use-case';
import { IFruitRepository } from '../../repos/fruit.repository';
import { Fruit } from '../../domain/fruit.entity';
import { FruitName } from '../../domain/value-objects/fruit-name.vo';
import { FruitDescription } from '../../domain/value-objects/fruit-description.vo';
import { FruitStorageLimit } from '../../domain/value-objects/fruit-storage-limit.vo';
import { DomainError } from '../../domain/fruit.errors';

describe('StoreFruitUseCase', () => {
    let useCase: StoreFruitUseCase;
    let mockRepo: jest.Mocked<IFruitRepository>;

    beforeEach(() => {
        mockRepo = {
            save: jest.fn(),
            findByName: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
            exists: jest.fn(),
        };
        useCase = new StoreFruitUseCase(mockRepo);
    });

    it('should successfully store fruit and update stock', async () => {
        const fruit = Fruit.create({
            name: FruitName.create('Apple').getValue(),
            description: FruitDescription.create('Red apple').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(100).getValue(),
        }).getValue();

        mockRepo.findByName.mockResolvedValue(fruit);
        mockRepo.save.mockResolvedValue();

        const result = await useCase.execute({ name: 'Apple', amount: 40 });
        expect(result.stock).toBe(40);
        expect(mockRepo.save).toHaveBeenCalledWith(fruit);
    });

    it('should throw DomainError when fruit does not exist', async () => {
        mockRepo.findByName.mockResolvedValue(null);

        await expect(useCase.execute({ name: 'Unknown', amount: 10 })).rejects.toThrow(DomainError);
        expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('should throw DomainError when storing exceeds storage limit', async () => {
        const fruit = Fruit.create({
            name: FruitName.create('Apple').getValue(),
            description: FruitDescription.create('Red apple').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(50).getValue(),
        }).getValue();

        mockRepo.findByName.mockResolvedValue(fruit);

        await expect(useCase.execute({ name: 'Apple', amount: 60 })).rejects.toThrow(DomainError);
        expect(mockRepo.save).not.toHaveBeenCalled();
    });
});

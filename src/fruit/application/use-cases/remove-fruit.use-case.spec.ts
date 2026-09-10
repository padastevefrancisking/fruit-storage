import { RemoveFruitUseCase } from './remove-fruit.use-case';
import { IFruitRepository } from '../../repos/fruit.repository';
import { Fruit } from '../../domain/fruit.entity';
import { FruitName } from '../../domain/value-objects/fruit-name.vo';
import { FruitDescription } from '../../domain/value-objects/fruit-description.vo';
import { FruitStorageLimit } from '../../domain/value-objects/fruit-storage-limit.vo';
import { DomainError } from '../../domain/fruit.errors';

describe('RemoveFruitUseCase', () => {
    let useCase: RemoveFruitUseCase;
    let mockRepo: jest.Mocked<IFruitRepository>;

    beforeEach(() => {
        mockRepo = {
            save: jest.fn(),
            findByName: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
            exists: jest.fn(),
        };
        useCase = new RemoveFruitUseCase(mockRepo);
    });

    it('should successfully remove stock from a fruit', async () => {
        const fruit = Fruit.create({
            name: FruitName.create('Apple').getValue(),
            description: FruitDescription.create('Red apple').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(100).getValue(),
        }).getValue();
        fruit.store(50);

        mockRepo.findByName.mockResolvedValue(fruit);
        mockRepo.save.mockResolvedValue();

        const result = await useCase.execute({ name: 'Apple', amount: 20 });
        expect(result.stock).toBe(30);
        expect(mockRepo.save).toHaveBeenCalledWith(fruit);
    });

    it('should throw DomainError when fruit does not exist', async () => {
        mockRepo.findByName.mockResolvedValue(null);

        await expect(useCase.execute({ name: 'Unknown', amount: 10 })).rejects.toThrow(DomainError);
        expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('should throw DomainError when attempting to remove more stock than available', async () => {
        const fruit = Fruit.create({
            name: FruitName.create('Apple').getValue(),
            description: FruitDescription.create('Red apple').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(100).getValue(),
        }).getValue();
        fruit.store(10);

        mockRepo.findByName.mockResolvedValue(fruit);

        await expect(useCase.execute({ name: 'Apple', amount: 20 })).rejects.toThrow(DomainError);
        expect(mockRepo.save).not.toHaveBeenCalled();
    });
});

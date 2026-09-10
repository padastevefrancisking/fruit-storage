import { DeleteFruitUseCase } from './delete-fruit.use-case';
import { IFruitRepository } from '../../repos/fruit.repository';
import { Fruit } from '../../domain/fruit.entity';
import { FruitName } from '../../domain/value-objects/fruit-name.vo';
import { FruitDescription } from '../../domain/value-objects/fruit-description.vo';
import { FruitStorageLimit } from '../../domain/value-objects/fruit-storage-limit.vo';
import { DomainError } from '../../domain/fruit.errors';

describe('DeleteFruitUseCase', () => {
    let useCase: DeleteFruitUseCase;
    let mockRepo: jest.Mocked<IFruitRepository>;

    beforeEach(() => {
        mockRepo = {
            save: jest.fn(),
            findByName: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
            exists: jest.fn(),
        };
        useCase = new DeleteFruitUseCase(mockRepo);
    });

    it('should successfully delete fruit when stock is empty', async () => {
        const fruit = Fruit.create({
            name: FruitName.create('Apple').getValue(),
            description: FruitDescription.create('Red apple').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(100).getValue(),
        }).getValue();

        mockRepo.findByName.mockResolvedValue(fruit);
        mockRepo.delete.mockResolvedValue();

        await expect(useCase.execute({ name: 'Apple', forceDelete: false })).resolves.not.toThrow();
        expect(mockRepo.delete).toHaveBeenCalledWith(fruit);
    });

    it('should throw DomainError with NOT_FOUND when fruit does not exist', async () => {
        mockRepo.findByName.mockResolvedValue(null);

        await expect(useCase.execute({ name: 'Ghost', forceDelete: false })).rejects.toThrow(DomainError);
        expect(mockRepo.delete).not.toHaveBeenCalled();
    });

    it('should throw DomainError when fruit has stock and forceDelete is false', async () => {
        const fruit = Fruit.create({
            name: FruitName.create('Apple').getValue(),
            description: FruitDescription.create('Red apple').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(100).getValue(),
        }).getValue();
        fruit.store(10);

        mockRepo.findByName.mockResolvedValue(fruit);

        await expect(useCase.execute({ name: 'Apple', forceDelete: false })).rejects.toThrow(DomainError);
        expect(mockRepo.delete).not.toHaveBeenCalled();
    });

    it('should successfully delete fruit when fruit has stock but forceDelete is true', async () => {
        const fruit = Fruit.create({
            name: FruitName.create('Apple').getValue(),
            description: FruitDescription.create('Red apple').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(100).getValue(),
        }).getValue();
        fruit.store(10);

        mockRepo.findByName.mockResolvedValue(fruit);
        mockRepo.delete.mockResolvedValue();

        await expect(useCase.execute({ name: 'Apple', forceDelete: true })).resolves.not.toThrow();
        expect(mockRepo.delete).toHaveBeenCalledWith(fruit);
    });
});

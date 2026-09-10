import { UpdateFruitUseCase } from './update-fruit.use-case';
import { IFruitRepository } from '../../repos/fruit.repository';
import { Fruit } from '../../domain/fruit.entity';
import { FruitName } from '../../domain/value-objects/fruit-name.vo';
import { FruitDescription } from '../../domain/value-objects/fruit-description.vo';
import { FruitStorageLimit } from '../../domain/value-objects/fruit-storage-limit.vo';
import { DomainError } from '../../domain/fruit.errors';

describe('UpdateFruitUseCase', () => {
    let useCase: UpdateFruitUseCase;
    let mockRepo: jest.Mocked<IFruitRepository>;

    beforeEach(() => {
        mockRepo = {
            save: jest.fn(),
            findByName: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
            exists: jest.fn(),
        };
        useCase = new UpdateFruitUseCase(mockRepo);
    });

    it('should successfully update fruit description and limit', async () => {
        const fruit = Fruit.create({
            name: FruitName.create('Apple').getValue(),
            description: FruitDescription.create('Old description').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(100).getValue(),
        }).getValue();

        mockRepo.findByName.mockResolvedValue(fruit);
        mockRepo.save.mockResolvedValue();

        const result = await useCase.execute({
            name: 'Apple',
            description: 'New juicy apple',
            limitOfFruitToBeStored: 200,
        });

        expect(result.description).toBe('New juicy apple');
        expect(result.limitOfFruitToBeStored).toBe(200);
        expect(mockRepo.save).toHaveBeenCalledWith(fruit);
    });

    it('should throw DomainError with NOT_FOUND when fruit does not exist', async () => {
        mockRepo.findByName.mockResolvedValue(null);

        await expect(
            useCase.execute({
                name: 'GhostFruit',
                description: 'Does not exist',
                limitOfFruitToBeStored: 100,
            })
        ).rejects.toThrow(DomainError);

        expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('should throw DomainError with INVALID_DESCRIPTION when description is invalid', async () => {
        const fruit = Fruit.create({
            name: FruitName.create('Apple').getValue(),
            description: FruitDescription.create('Old description').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(100).getValue(),
        }).getValue();

        mockRepo.findByName.mockResolvedValue(fruit);

        await expect(
            useCase.execute({
                name: 'Apple',
                description: 'A'.repeat(35), // too long
                limitOfFruitToBeStored: 100,
            })
        ).rejects.toThrow(DomainError);

        expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('should throw DomainError with INVALID_LIMIT when storage limit is invalid', async () => {
        const fruit = Fruit.create({
            name: FruitName.create('Apple').getValue(),
            description: FruitDescription.create('Old description').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(100).getValue(),
        }).getValue();

        mockRepo.findByName.mockResolvedValue(fruit);

        await expect(
            useCase.execute({
                name: 'Apple',
                description: 'Valid description',
                limitOfFruitToBeStored: -50, // invalid limit
            })
        ).rejects.toThrow(DomainError);

        expect(mockRepo.save).not.toHaveBeenCalled();
    });
});

import { CreateFruitUseCase } from './create-fruit.use-case';
import { FruitFactory } from '../../domain/factory/fruit.factory';
import { IFruitRepository } from '../repos/fruit.repository';
import { Result } from '../../../shared/core/result';
import { Fruit } from '../../domain/fruit.entity';
import { FruitName } from '../../domain/value-objects/fruit-name.vo';
import { FruitDescription } from '../../domain/value-objects/fruit-description.vo';
import { FruitStorageLimit } from '../../domain/value-objects/fruit-storage-limit.vo';
import { DomainError } from '../../domain/fruit.errors';

describe('CreateFruitUseCase', () => {
    let useCase: CreateFruitUseCase;
    let mockFactory: jest.Mocked<FruitFactory>;
    let mockRepo: jest.Mocked<IFruitRepository>;

    beforeEach(() => {
        mockFactory = {
            create: jest.fn(),
        } as any;
        mockRepo = {
            save: jest.fn(),
            findByName: jest.fn(),
            findAll: jest.fn(),
            delete: jest.fn(),
            exists: jest.fn(),
        };
        useCase = new CreateFruitUseCase(mockFactory, mockRepo);
    });

    it('should successfully create and save a fruit', async () => {
        const fruit = Fruit.create({
            name: FruitName.create('Apple').getValue(),
            description: FruitDescription.create('Red apple').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(100).getValue(),
        }).getValue();

        mockFactory.create.mockResolvedValue(Result.ok(fruit));
        mockRepo.save.mockResolvedValue();

        const result = await useCase.execute({
            name: 'Apple',
            description: 'Red apple',
            limitOfFruitToBeStored: 100,
        });

        expect(result.name).toBe('Apple');
        expect(result.description).toBe('Red apple');
        expect(result.limitOfFruitToBeStored).toBe(100);
        expect(result.stock).toBe(0);
        expect(mockRepo.save).toHaveBeenCalledWith(fruit);
    });

    it('should throw DomainError when factory creation fails', async () => {
        mockFactory.create.mockResolvedValue(
            Result.fail('A fruit with the name "Apple" already exists.')
        );

        await expect(
            useCase.execute({
                name: 'Apple',
                description: 'Red apple',
                limitOfFruitToBeStored: 100,
            })
        ).rejects.toThrow(DomainError);

        expect(mockRepo.save).not.toHaveBeenCalled();
    });
});

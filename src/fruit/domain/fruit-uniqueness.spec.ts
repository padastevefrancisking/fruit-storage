import { FruitUniquenessService } from './fruit-uniqueness';
import { FruitName } from './value-objects/fruit-name.vo';
import { IFruitRepository } from '../repos/fruit.repository';

describe('FruitUniquenessService', () => {
    let service: FruitUniquenessService;
    let mockRepo: jest.Mocked<IFruitRepository>;

    beforeEach(() => {
        mockRepo = {
            exists: jest.fn(),
            findByName: jest.fn(),
            findAll: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
        };
        service = new FruitUniquenessService(mockRepo);
    });

    it('should return true when fruit name does not exist', async () => {
        mockRepo.exists.mockResolvedValue(false);
        const name = FruitName.create('Apple').getValue();

        const isUnique = await service.isUnique(name);
        expect(isUnique).toBe(true);
        expect(mockRepo.exists).toHaveBeenCalledWith('Apple');
    });

    it('should return false when fruit name already exists', async () => {
        mockRepo.exists.mockResolvedValue(true);
        const name = FruitName.create('Apple').getValue();

        const isUnique = await service.isUnique(name);
        expect(isUnique).toBe(false);
        expect(mockRepo.exists).toHaveBeenCalledWith('Apple');
    });
});

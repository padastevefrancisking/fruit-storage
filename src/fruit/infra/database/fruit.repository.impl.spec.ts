import { MongooseFruitRepository } from './fruit.repository.impl';
import { Model, Connection, ClientSession } from 'mongoose';
import { FruitDocument } from './fruit.schema';
import { IOutboxRepository } from './outbox/repos/outbox.repository';
import { Fruit } from '../../domain/fruit.entity';
import { FruitName } from '../../domain/value-objects/fruit-name.vo';
import { FruitDescription } from '../../domain/value-objects/fruit-description.vo';
import { FruitStorageLimit } from '../../domain/value-objects/fruit-storage-limit.vo';
import { UniqueEntityID } from '../../../shared/domain/unique-entity-id';

describe('MongooseFruitRepository', () => {
    let repository: MongooseFruitRepository;
    let mockFruitModel: Partial<Record<keyof Model<FruitDocument>, jest.Mock>>;
    let mockConnection: Partial<Record<keyof Connection, jest.Mock>>;
    let mockOutboxRepository: jest.Mocked<IOutboxRepository>;
    let mockSession: Partial<ClientSession>;

    const createFruit = (name = 'Apple', description = 'Fresh apple', limit = 100, id?: string) => {
        return Fruit.create(
            {
                name: FruitName.create(name).getValue(),
                description: FruitDescription.create(description).getValue(),
                limitOfFruitToBeStored: FruitStorageLimit.create(limit).getValue(),
            },
            id ? new UniqueEntityID(id) : undefined
        ).getValue();
    };

    beforeEach(() => {
        mockSession = {
            withTransaction: jest.fn().mockImplementation(async (cb: () => Promise<void>) => {
                await cb();
            }),
            endSession: jest.fn().mockResolvedValue(undefined),
        };

        mockFruitModel = {
            exists: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
        };

        mockConnection = {
            startSession: jest.fn().mockResolvedValue(mockSession),
        };

        mockOutboxRepository = {
            addEvents: jest.fn().mockResolvedValue(undefined),
            findUndelivered: jest.fn().mockResolvedValue([]),
            markDelivered: jest.fn().mockResolvedValue(undefined),
            incrementAttempts: jest.fn().mockResolvedValue(undefined),
        };

        repository = new MongooseFruitRepository(
            mockFruitModel as unknown as Model<FruitDocument>,
            mockConnection as unknown as Connection,
            mockOutboxRepository
        );
    });

    describe('exists', () => {
        it('should return true when a fruit exists with trimmed lowercase name', async () => {
            (mockFruitModel.exists as jest.Mock).mockResolvedValueOnce({ _id: 'some-id' });

            const result = await repository.exists('  Apple  ');

            expect(mockFruitModel.exists).toHaveBeenCalledWith({ name: 'apple' });
            expect(result).toBe(true);
        });

        it('should return false when a fruit does not exist', async () => {
            (mockFruitModel.exists as jest.Mock).mockResolvedValueOnce(null);

            const result = await repository.exists('Orange');

            expect(mockFruitModel.exists).toHaveBeenCalledWith({ name: 'orange' });
            expect(result).toBe(false);
        });
    });

    describe('findByName', () => {
        it('should return Fruit entity when raw document is found', async () => {
            const raw = {
                _id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Banana',
                description: 'Yellow banana',
                limitOfFruitToBeStored: 50,
                stock: 10,
            };

            const leanMock = jest.fn().mockResolvedValue(raw);
            (mockFruitModel.findOne as jest.Mock).mockReturnValue({ lean: leanMock });

            const result = await repository.findByName('Banana');

            expect(mockFruitModel.findOne).toHaveBeenCalledWith({ name: 'Banana' });
            expect(result).toBeInstanceOf(Fruit);
            expect(result?.name.value).toBe('Banana');
            expect(result?.stock.value).toBe(10);
        });

        it('should return null when raw document is not found', async () => {
            const leanMock = jest.fn().mockResolvedValue(null);
            (mockFruitModel.findOne as jest.Mock).mockReturnValue({ lean: leanMock });

            const result = await repository.findByName('Unknown');

            expect(result).toBeNull();
        });
    });

    describe('findAll', () => {
        it('should return an array of Fruit domain entities', async () => {
            const rawList = [
                {
                    _id: '123e4567-e89b-12d3-a456-426614174001',
                    name: 'Apple',
                    description: 'Red apple',
                    limitOfFruitToBeStored: 100,
                    stock: 20,
                },
                {
                    _id: '123e4567-e89b-12d3-a456-426614174002',
                    name: 'Banana',
                    description: 'Yellow fruit',
                    limitOfFruitToBeStored: 80,
                    stock: 15,
                },
            ];

            const leanMock = jest.fn().mockResolvedValue(rawList);
            (mockFruitModel.find as jest.Mock).mockReturnValue({ lean: leanMock });

            const result = await repository.findAll();

            expect(result).toHaveLength(2);
            expect(result[0].name.value).toBe('Apple');
            expect(result[1].name.value).toBe('Banana');
        });
    });

    describe('save', () => {
        it('should update fruit and add outbox events within transaction, then clear events', async () => {
            const fruit = createFruit('Mango', 'Sweet mango', 60, '123e4567-e89b-12d3-a456-426614174003');
            (mockFruitModel.updateOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true });

            await repository.save(fruit);

            expect(mockConnection.startSession).toHaveBeenCalled();
            expect(mockSession.withTransaction).toHaveBeenCalled();
            expect(mockFruitModel.updateOne).toHaveBeenCalledWith(
                { _id: fruit.id.toString() },
                {
                    $set: expect.objectContaining({
                        name: 'Mango',
                        description: 'Sweet mango',
                        limitOfFruitToBeStored: 60,
                    }),
                },
                { upsert: true, session: mockSession }
            );
            expect(mockOutboxRepository.addEvents).toHaveBeenCalledWith(expect.any(Array), mockSession);
            expect(fruit.domainEvents).toHaveLength(0);
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it('should end session even when transaction fails', async () => {
            const fruit = createFruit('Mango');
            (mockSession.withTransaction as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

            await expect(repository.save(fruit)).rejects.toThrow('DB Error');

            expect(mockSession.endSession).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should delete fruit and add outbox events within transaction, then clear events', async () => {
            const fruit = createFruit('Papaya', 'Tropical', 30, '123e4567-e89b-12d3-a456-426614174004');
            (mockFruitModel.deleteOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true });

            await repository.delete(fruit);

            expect(mockConnection.startSession).toHaveBeenCalled();
            expect(mockSession.withTransaction).toHaveBeenCalled();
            expect(mockFruitModel.deleteOne).toHaveBeenCalledWith(
                { _id: fruit.id.toString() },
                { session: mockSession }
            );
            expect(mockOutboxRepository.addEvents).toHaveBeenCalledWith(expect.any(Array), mockSession);
            expect(fruit.domainEvents).toHaveLength(0);
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it('should end session even when deletion fails', async () => {
            const fruit = createFruit('Papaya');
            (mockSession.withTransaction as jest.Mock).mockRejectedValueOnce(new Error('Delete Error'));

            await expect(repository.delete(fruit)).rejects.toThrow('Delete Error');

            expect(mockSession.endSession).toHaveBeenCalled();
        });
    });
});

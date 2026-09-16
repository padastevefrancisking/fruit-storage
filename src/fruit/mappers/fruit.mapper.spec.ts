import { FruitMapper, FruitPersistence } from './fruit.mapper';
import { Fruit } from '../domain/fruit.entity';
import { FruitName } from '../domain/value-objects/fruit-name.vo';
import { FruitDescription } from '../domain/value-objects/fruit-description.vo';
import { FruitStorageLimit } from '../domain/value-objects/fruit-storage-limit.vo';
import { UniqueEntityID } from '../../shared/domain/unique-entity-id';

describe('FruitMapper', () => {
    const createSampleFruit = () => {
        const id = new UniqueEntityID('fruit-uuid-1');
        return Fruit.create({
            name: FruitName.create('Mango').getValue(),
            description: FruitDescription.create('Sweet mango').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(150).getValue(),
        }, id).getValue();
    };

    describe('toDTO', () => {
        it('should map a Fruit domain entity to a FruitDTO', () => {
            const fruit = createSampleFruit();
            const dto = FruitMapper.toDTO(fruit);

            expect(dto).toEqual({
                id: 'fruit-uuid-1',
                name: 'Mango',
                description: 'Sweet mango',
                limitOfFruitToBeStored: 150,
                stock: 0,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });
    });

    describe('toDomain', () => {
        it('should reconstitute a valid Fruit domain entity from persistence', () => {
            const createdAt = new Date('2026-01-01');
            const updatedAt = new Date('2026-01-02');
            const raw: FruitPersistence = {
                _id: 'mongo-id-123',
                name: 'Banana',
                description: 'Yellow fruit',
                limitOfFruitToBeStored: 100,
                stock: 25,
                createdAt,
                updatedAt,
            };

            const fruit = FruitMapper.toDomain(raw);

            expect(fruit).toBeInstanceOf(Fruit);
            expect(fruit.id.toString()).toBe('mongo-id-123');
            expect(fruit.name.value).toBe('Banana');
            expect(fruit.description.value).toBe('Yellow fruit');
            expect(fruit.limitOfFruitToBeStored.value).toBe(100);
            expect(fruit.stock.value).toBe(25);
            expect(fruit.createdAt).toBe(createdAt);
            expect(fruit.updatedAt).toBe(updatedAt);
        });

        it('should throw an error when persistence document contains invalid data', () => {
            const invalidRaw: FruitPersistence = {
                _id: 'bad-id',
                name: '',
                description: 'Valid description',
                limitOfFruitToBeStored: -10,
                stock: -5,
            };

            expect(() => FruitMapper.toDomain(invalidRaw)).toThrow(/Corrupt fruit document/);
        });
    });

    describe('toPersistence', () => {
        it('should map a Fruit domain entity to persistence format without _id', () => {
            const fruit = createSampleFruit();
            fruit.store(30);

            const persistence = FruitMapper.toPersistence(fruit);

            expect(persistence).toEqual({
                name: 'Mango',
                description: 'Sweet mango',
                limitOfFruitToBeStored: 150,
                stock: 30,
            });
            expect((persistence as any)._id).toBeUndefined();
        });
    });
});

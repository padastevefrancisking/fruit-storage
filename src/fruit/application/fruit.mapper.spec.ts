import { FruitMapper } from './fruit.mapper';
import { Fruit } from '../domain/fruit.entity';
import { FruitName } from '../domain/value-objects/fruit-name.vo';
import { FruitDescription } from '../domain/value-objects/fruit-description.vo';
import { FruitStorageLimit } from '../domain/value-objects/fruit-storage-limit.vo';
import { UniqueEntityID } from '../../shared/domain/unique-entity-id';

describe('FruitMapper', () => {
    it('should map a Fruit domain entity to a FruitDTO', () => {
        const id = new UniqueEntityID('fruit-uuid-1');
        const fruit = Fruit.create({
            name: FruitName.create('Mango').getValue(),
            description: FruitDescription.create('Sweet mango').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(150).getValue(),
        }, id).getValue();

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

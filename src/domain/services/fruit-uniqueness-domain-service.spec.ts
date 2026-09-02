import { FruitUniquenessDomainService } from './fruit-uniqueness-domain-service';
import { Fruit } from '../entities/fruit';
import { FruitAlreadyExistsError } from '../errors';

describe('FruitUniquenessDomainService', () => {
    let fruitUniquenessDomainService: FruitUniquenessDomainService;

    beforeEach(() => {
        fruitUniquenessDomainService = new FruitUniquenessDomainService();
    });

    it('should not throw an error for unique fruit names', () => {
        const existingFruits: Fruit[] = [
            new Fruit('Apple', 'A sweet red fruit', 100),
            new Fruit('Banana', 'A long yellow fruit', 50)
        ];

        expect(() => {
            fruitUniquenessDomainService.ensureUniqueFruitName('Orange', existingFruits);
        }).not.toThrow();
    });

    it('should throw an error for duplicate fruit names', () => {
        const existingFruits: Fruit[] = [
            new Fruit('Apple', 'A sweet red fruit', 100),
            new Fruit('Banana', 'A long yellow fruit', 50)
        ];

        expect(() => {
            fruitUniquenessDomainService.ensureUniqueFruitName('Apple', existingFruits);
        }).toThrow(FruitAlreadyExistsError);
    });
})
import { Fruit } from '../entities/fruit';
import { FruitAlreadyExistsError } from '../errors';

export class FruitUniquenessDomainService {
    ensureUniqueFruitName(fruitName: string, existingFruits: Fruit[]): void {
        const isDuplicate = existingFruits.some(fruit => fruit.name.toLowerCase() === fruitName.toLowerCase());
        if (isDuplicate) {
            throw new FruitAlreadyExistsError(`A fruit with the name "${fruitName}" already exists.`);
        }
    }
}

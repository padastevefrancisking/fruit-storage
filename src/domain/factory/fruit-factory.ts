import { Fruit } from '../entities/fruit';
import { FruitDescription } from '../value-objects/fruit-description';

export class FruitFactory {
    public static createFruit(name: string, description: string, limitOfFruitToBeStored: number): Fruit {
        const fruitDescription = FruitDescription.create(description);
        return new Fruit(name, fruitDescription, limitOfFruitToBeStored);
    }
}
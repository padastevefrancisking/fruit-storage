import { Fruit } from "../domain/fruit.entity";
import { FruitDTO } from "./dtos/fruit.dto";

export class FruitMapper {
    public static toDTO(fruit: Fruit): FruitDTO {
        return {
            id: fruit.id.toString(),
            name: fruit.name.value,
            description: fruit.description.value,
            limitOfFruitToBeStored: fruit.limitOfFruitToBeStored.value,
            stock: fruit.stock.value,
            createdAt: fruit.createdAt,
            updatedAt: fruit.updatedAt
        };
    }
}
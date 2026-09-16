import { Mapper } from "../../shared/infra/mapper";
import { Fruit } from "../domain/fruit.entity";
import { FruitDTO } from "../application/dtos/fruit.dto";
import { FruitName } from "../domain/value-objects/fruit-name.vo";
import { FruitDescription } from "../domain/value-objects/fruit-description.vo";
import { FruitStorageLimit } from "../domain/value-objects/fruit-storage-limit.vo";
import { FruitStock } from "../domain/value-objects/fruit-stock.vo";
import { UniqueEntityID } from "../../shared/domain/unique-entity-id";

export interface FruitPersistence {
    _id: string;
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class FruitMapper implements Mapper<Fruit> {
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

    public static toDomain(raw: FruitPersistence): Fruit {
        const nameResult = FruitName.create(raw.name);
        const descriptionResult = FruitDescription.create(raw.description);
        const limitResult = FruitStorageLimit.create(raw.limitOfFruitToBeStored);
        const stockResult = FruitStock.create(raw.stock);

        if (nameResult.isFailure
            || descriptionResult.isFailure
            || limitResult.isFailure
            || stockResult.isFailure
        ) {
            throw new Error(
                `Corrupt fruit document for "${raw.name}" (_id ${raw._id}): ` + 
                [nameResult, descriptionResult, limitResult, stockResult]
                    .filter((r) => r.isFailure)
                    .map((r) => r.getErrorValue())
                    .join("; ")
            )
        }

        const fruitResult = Fruit.create(
            {
                name: nameResult.getValue(),
                description: descriptionResult.getValue(),
                limitOfFruitToBeStored: limitResult.getValue(),
                stock: stockResult.getValue(),
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            new UniqueEntityID(raw._id)
        )

        return fruitResult.getValue();
    }

    public static toPersistence(fruit: Fruit): Omit<FruitPersistence, '_id'> {
        return {
            name: fruit.name.value,
            description: fruit.description.value,
            limitOfFruitToBeStored: fruit.limitOfFruitToBeStored.value,
            stock: fruit.stock.value
        }
    }
}
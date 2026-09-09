import { Injectable, Res } from "@nestjs/common";
import { FruitUniquenessService } from "../fruit-uniqueness";
import { Result } from "../../../shared/core/result";
import { Fruit } from "../fruit.entity";
import { FruitName } from "../value-objects/fruit-name.vo";
import { FruitDescription } from "../value-objects/fruit-description.vo";
import { FruitStorageLimit } from "../value-objects/fruit-storage-limit.vo";

export interface CreateFruitProps{
    name: string,
    description: string,
    limitOfFruitToBeStored: number
}

@Injectable()
export class FruitFactory{
    constructor(
        private readonly fruitUniquenessService: FruitUniquenessService
    ) {}

    public async create(props: CreateFruitProps): Promise<Result<Fruit>> {
        const nameResult = FruitName.create(props.name);
        const descriptionResult = FruitDescription.create(props.description);
        const storageLimitResult = FruitStorageLimit.create(props.limitOfFruitToBeStored);

        const combinedResult = Result.combine([
            nameResult,
            descriptionResult,
            storageLimitResult
        ]);

        if (combinedResult.isFailure) {
            return Result.fail<Fruit>(combinedResult.getErrorValue());
        }

        const fruitName = nameResult.getValue()
        const isNameUnique = this.fruitUniquenessService.isUnique(fruitName);
        if (!isNameUnique) {
            return Result.fail<Fruit>(`A fruit with the name ${fruitName} already exists.`)
        }

        const fruitDescription = descriptionResult.getValue();
        const fruitStorageLimit = storageLimitResult.getValue();

        return Fruit.create({
            name: fruitName,
            description: fruitDescription,
            limitOfFruitToBeStored: fruitStorageLimit
        })
    }
}
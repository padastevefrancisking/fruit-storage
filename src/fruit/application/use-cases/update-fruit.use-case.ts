import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "../../../shared/application/use-case";
import { FRUIT_REPOSITORY } from "../../repos/fruit.repository";
import { UpdateFruitDTO } from "../dtos/update-fruit.dto";
import { FruitDTO } from "../dtos/fruit.dto";
import { DomainError, FruitErrorCode } from "../../domain/fruit.errors";
import { FruitDescription } from "../../domain/value-objects/fruit-description.vo";
import { FruitStorageLimit } from "../../domain/value-objects/fruit-storage-limit.vo";
import { FruitMapper } from "../fruit.mapper";
import type { IFruitRepository } from "../../repos/fruit.repository";

@Injectable()
export class UpdateFruitUseCase implements UseCase<UpdateFruitDTO, FruitDTO> {
    constructor(
        @Inject(FRUIT_REPOSITORY) private readonly fruitRepository: IFruitRepository
    ) {}

    async execute(request: UpdateFruitDTO): Promise<FruitDTO> {
        const fruit = await this.fruitRepository.findByName(request.name);
        if (!fruit) {
            throw new DomainError(
                FruitErrorCode.NOT_FOUND,
                `Fruit "${request.name}" was not found.`
            );
        }

        const descriptionResult = FruitDescription.create(request.description);
        if (descriptionResult.isFailure) {
            throw new DomainError(
                FruitErrorCode.INVALID_DESCRIPTION,
                descriptionResult.getErrorValue()
            )
        }

        const storageLimitResult = FruitStorageLimit.create(request.limitOfFruitToBeStored);
        if (storageLimitResult.isFailure) {
            throw new DomainError(
                FruitErrorCode.INVALID_LIMIT,
                storageLimitResult.getErrorValue()
            );
        }

        fruit.updateDescription(descriptionResult.getValue());
        fruit.updateStorageLimit(storageLimitResult.getValue());

        await this.fruitRepository.save(fruit);

        return FruitMapper.toDTO(fruit);
    }
}
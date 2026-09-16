import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "../../../shared/application/use-case";
import { RemoveFruitDTO } from "../dtos/remove-fruit.dto";
import { FruitDTO } from "../dtos/fruit.dto";
import { FRUIT_REPOSITORY } from "../../repos/fruit.repository";
import type { IFruitRepository } from "../../repos/fruit.repository";
import { FruitMapper } from "../../mappers/fruit.mapper";
import { DomainError, FruitErrorCode } from "../../domain/fruit.errors";

@Injectable()
export class RemoveFruitUseCase implements UseCase<RemoveFruitDTO, FruitDTO> {
    constructor(
        @Inject(FRUIT_REPOSITORY) private readonly fruitRepository: IFruitRepository
    ) {}

    async execute(request: RemoveFruitDTO): Promise<FruitDTO> {
        const fruit = await this.fruitRepository.findByName(request.name);
        if (!fruit) {
            throw new DomainError(
                FruitErrorCode.NOT_FOUND,
                `Fruit "${request.name}" was not found.`
            );
        }

        const removeResult = fruit.remove(request.amount);
        if (removeResult.isFailure) {
            throw new DomainError(
                FruitErrorCode.INSUFFICIENT_STOCK,
                removeResult.getErrorValue()
            )
        }

        await this.fruitRepository.save(fruit);
        
        return FruitMapper.toDTO(fruit);
    }
}
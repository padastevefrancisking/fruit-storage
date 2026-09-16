import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "../../../shared/application/use-case";
import { StoreFruitDTO } from "../dtos/store-fruit.dto";
import { FruitDTO } from "../dtos/fruit.dto";
import { FRUIT_REPOSITORY } from "../../repos/fruit.repository";
import type { IFruitRepository } from "../../repos/fruit.repository";
import { DomainError, FruitErrorCode } from "../../domain/fruit.errors";
import { FruitMapper } from "../../mappers/fruit.mapper";

@Injectable()
export class StoreFruitUseCase implements UseCase<StoreFruitDTO, FruitDTO> {
    constructor(
        @Inject(FRUIT_REPOSITORY) private readonly fruitRepository: IFruitRepository
    ) {}

    async execute(request: StoreFruitDTO): Promise<FruitDTO> {
        const fruit = await this.fruitRepository.findByName(request.name);
        if (!fruit) {
            throw new DomainError(
                FruitErrorCode.NOT_FOUND,
                `Fruit "${request.name}" was not found.`
            );
        }

        const storeResult = fruit.store(request.amount);
        if (storeResult.isFailure) {
            throw new DomainError(
                FruitErrorCode.STORAGE_LIMIT_EXCEEDED,
                storeResult.getErrorValue()
            );
        }

        await this.fruitRepository.save(fruit);

        return FruitMapper.toDTO(fruit);
    }
}
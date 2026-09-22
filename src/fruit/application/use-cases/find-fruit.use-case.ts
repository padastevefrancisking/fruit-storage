import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "../../../shared/application/use-case";
import { FRUIT_REPOSITORY } from "../repos/fruit.repository";
import { FindFruitDTO } from "../dtos/find-fruit.dto";
import { FruitDTO } from "../dtos/fruit.dto";
import type { IFruitRepository } from "../repos/fruit.repository";
import { DomainError, FruitErrorCode } from "../../domain/fruit.errors";
import { FruitMapper } from "../../mappers/fruit.mapper";

@Injectable()
export class FindFruitUseCase implements UseCase<FindFruitDTO, FruitDTO> {
    constructor(
        @Inject(FRUIT_REPOSITORY) private readonly fruitRepository: IFruitRepository
    ) {}

    async execute(request: FindFruitDTO): Promise<FruitDTO> {
        const fruit = await this.fruitRepository.findByName(request.name);
        if (!fruit) {
            throw new DomainError(
                FruitErrorCode.NOT_FOUND,
                `Fruit "${request.name} was not found.`
            )
        }

        return FruitMapper.toDTO(fruit);
    }
}
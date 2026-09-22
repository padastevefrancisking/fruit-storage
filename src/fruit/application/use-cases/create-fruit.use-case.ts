import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "../../../shared/application/use-case";
import { CreateFruitDTO } from "../dtos/create-fruit.dto";
import { FruitDTO } from "../dtos/fruit.dto";
import { FRUIT_REPOSITORY } from "../repos/fruit.repository";
import { FruitFactory } from "../../domain/factory/fruit.factory";
import { DomainError, FruitErrorCode } from "../../domain/fruit.errors";
import { FruitMapper } from "../../mappers/fruit.mapper";
import type { IFruitRepository } from "../repos/fruit.repository";

@Injectable()
export class CreateFruitUseCase implements UseCase<CreateFruitDTO, Promise<FruitDTO>> {
    constructor(
        private readonly fruitFactory: FruitFactory,
        @Inject(FRUIT_REPOSITORY) private readonly fruitRepository: IFruitRepository
    ) {}

    async execute(request: CreateFruitDTO): Promise<FruitDTO> {
        const fruitResult = await this.fruitFactory.create({
            name: request.name,
            description: request.description,
            limitOfFruitToBeStored: request.limitOfFruitToBeStored
        });

        if (fruitResult.isFailure) {
            throw new DomainError(
                FruitErrorCode.NAME_ALREADY_EXISTS,
                fruitResult.getErrorValue()
            )
        }

        const fruit = fruitResult.getValue();
        await this.fruitRepository.save(fruit);

        return FruitMapper.toDTO(fruit);
    }
}
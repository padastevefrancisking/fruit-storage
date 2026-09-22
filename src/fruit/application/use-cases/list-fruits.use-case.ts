import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "../../../shared/application/use-case";
import { FruitDTO } from "../dtos/fruit.dto";
import { FRUIT_REPOSITORY } from "../repos/fruit.repository";
import type { IFruitRepository } from "../repos/fruit.repository";
import { FruitMapper } from "../../mappers/fruit.mapper";

@Injectable()
export class ListFruitsUseCase implements UseCase<void, FruitDTO[]> {
    constructor(
        @Inject(FRUIT_REPOSITORY) private readonly fruitRepository: IFruitRepository
    ) {}

    async execute(): Promise<FruitDTO[]> {
        const fruits = await this.fruitRepository.findAll();
        return fruits.map(FruitMapper.toDTO);
    }
}
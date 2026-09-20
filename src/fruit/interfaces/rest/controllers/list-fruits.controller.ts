import { Controller, Get } from "@nestjs/common";
import { FruitDTO } from "../../../application/dtos/fruit.dto";
import { ListFruitsUseCase } from "../../../application/use-cases/list-fruits.use-case";

@Controller('fruits')
export class ListFruitsController {
    constructor(
        private readonly listFruits: ListFruitsUseCase
    ) {}

    @Get()
    async handle(): Promise<FruitDTO[]> {
        return await this.listFruits.execute();
    }
}
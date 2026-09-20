import { Controller, Get, Param } from "@nestjs/common";
import { FindFruitUseCase } from "../../../application/use-cases/find-fruit.use-case";
import { FruitDTO } from "../../../application/dtos/fruit.dto";

@Controller('fruits')
export class FindFruitController {
    constructor(
        private readonly findFruit: FindFruitUseCase 
    ) {}

    @Get(':name')
    async handle(@Param('name') name: string): Promise<FruitDTO> {
        return await this.findFruit.execute({name});
    }
}
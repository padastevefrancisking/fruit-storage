import { Body, Controller, Param, Put } from "@nestjs/common";
import { RemoveFruitRequestDTO } from "../dtos/remove-fruit.request-dto";
import { FruitDTO } from "../../../application/dtos/fruit.dto";
import { RemoveFruitUseCase } from "../../../application/use-cases/remove-fruit.use-case";

@Controller('fruits')
export class RemoveFruitController {
    constructor(
        private readonly removeFruit: RemoveFruitUseCase
    ) {}

    @Put(':name/remove')
    async handle(
        @Param('name') name: string, 
        @Body() dto: RemoveFruitRequestDTO)
    : Promise<FruitDTO> {
        return await this.removeFruit.execute({name, ...dto})
    }
}
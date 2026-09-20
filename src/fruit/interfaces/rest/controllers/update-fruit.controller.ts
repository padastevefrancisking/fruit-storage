import { Body, Controller, Param, Put } from "@nestjs/common";
import { UpdateFruitUseCase } from "../../../application/use-cases/update-fruit.use-case";
import { UpdateFruitRequestDTO } from "../dtos/update-fruit.request-dto";
import { FruitDTO } from "../../../application/dtos/fruit.dto";

@Controller('fruits')
export class UpdateFruitController {
    constructor(
        private readonly updateFruit: UpdateFruitUseCase
    ) {}

    @Put(':name')
    async handle(
        @Param('name') name: string,
        @Body() dto: UpdateFruitRequestDTO
    ) : Promise<FruitDTO> {
        return await this.updateFruit.execute({name, ...dto});
    }
}
import { Body, Controller, Param, Put } from "@nestjs/common";
import { StoreFruitUseCase } from "../../../application/use-cases/store-fruit.use-case";
import { FruitDTO } from "../../../application/dtos/fruit.dto";
import { StoreFruitRequestDTO } from "../dtos/store-fruit.request-dto";

@Controller('fruits')
export class StoreFruitController {
    constructor(
        private readonly storeFruit: StoreFruitUseCase
    ) {}

    @Put(":name/store")
    async handle(
        @Param('name') name: string,
        @Body() dto: StoreFruitRequestDTO
    ): Promise<FruitDTO> {
        return await this.storeFruit.execute({name, ...dto})
    }
}
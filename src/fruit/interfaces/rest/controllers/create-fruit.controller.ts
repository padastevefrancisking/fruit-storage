import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { CreateFruitUseCase } from "../../../application/use-cases/create-fruit.use-case";
import { CreateFruitRequestDTO } from "../dtos/create-fruit.request-dto";
import { FruitDTO } from "../../../application/dtos/fruit.dto";

@Controller('fruits')
export class CreateFruitController {
    constructor(
        private readonly createFruit: CreateFruitUseCase 
    ) {}

    @Post()
    @HttpCode(201)
    async handle(@Body() dto: CreateFruitRequestDTO): Promise<FruitDTO> {
        return await this.createFruit.execute(dto);
    }
}
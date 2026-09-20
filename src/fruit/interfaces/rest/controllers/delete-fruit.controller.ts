import { Controller, Delete, HttpCode, Param, Query } from "@nestjs/common";
import { DeleteFruitUseCase } from "../../../application/use-cases/delete-fruit.use-case";

@Controller('fruits')
export class DeleteFruitController {
    constructor(
        private readonly deleteFruit: DeleteFruitUseCase
    ) {}

    @Delete(':name')
    @HttpCode(204)
    async handle(
        @Param('name') name: string, 
        @Query('forceDelete') forceDelete?: string)
    : Promise<void> {
        await this.deleteFruit.execute({name, forceDelete: forceDelete === 'true'});
    }
}
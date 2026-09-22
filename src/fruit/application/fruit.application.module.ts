import { Module } from "@nestjs/common";
import { CreateFruitUseCase } from "./use-cases/create-fruit.use-case";
import { DeleteFruitUseCase } from "./use-cases/delete-fruit.use-case";
import { FindFruitUseCase } from "./use-cases/find-fruit.use-case";
import { ListFruitsUseCase } from "./use-cases/list-fruits.use-case";
import { RemoveFruitUseCase } from "./use-cases/remove-fruit.use-case";
import { StoreFruitUseCase } from "./use-cases/store-fruit.use-case";
import { UpdateFruitUseCase } from "./use-cases/update-fruit.use-case";
import { FruitInfrastructureModule } from "../infrastructure/fruit.infrastructure.module";
import { FruitUniquenessService } from "../domain/fruit-uniqueness";
import { FruitFactory } from "../domain/factory/fruit.factory";

const useCases = [
    CreateFruitUseCase,
    DeleteFruitUseCase,
    FindFruitUseCase,
    ListFruitsUseCase,
    RemoveFruitUseCase,
    StoreFruitUseCase,
    UpdateFruitUseCase
];

@Module({
    imports: [ FruitInfrastructureModule ],
    controllers: [],
    providers: [ 
        FruitUniquenessService, 
        FruitFactory,
        ...useCases
    ],
    exports: [...useCases]
})
export class FruitApplicationModule {}
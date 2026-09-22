import { CreateFruitController } from "./rest/controllers/create-fruit.controller";
import { DeleteFruitController } from "./rest/controllers/delete-fruit.controller";
import { FindFruitController } from "./rest/controllers/find-fruit.controller";
import { ListFruitsController } from "./rest/controllers/list-fruits.controller";
import { RemoveFruitController } from "./rest/controllers/remove-fruit.controller";
import { StoreFruitController } from "./rest/controllers/store-fruit.controller";
import { UpdateFruitController } from "./rest/controllers/update-fruit.controller";

import { Module } from "@nestjs/common";
import { FruitApplicationModule } from "../application/fruit.application.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { fruitSchema } from "./graphql/schema";

import { CreateFruitUseCase } from "../application/use-cases/create-fruit.use-case";
import { FindFruitUseCase } from "../application/use-cases/find-fruit.use-case";
import { ListFruitsUseCase } from "../application/use-cases/list-fruits.use-case";
import { RemoveFruitUseCase } from "../application/use-cases/remove-fruit.use-case";
import { StoreFruitUseCase } from "../application/use-cases/store-fruit.use-case";
import { UpdateFruitUseCase } from "../application/use-cases/update-fruit.use-case";
import { DeleteFruitUseCase } from "../application/use-cases/delete-fruit.use-case";

import { APP_FILTER } from "@nestjs/core";
import { DomainErrorFilter } from "./rest/domain-error.filter";

const controllers = [
    CreateFruitController,
    DeleteFruitController,
    FindFruitController,
    ListFruitsController,
    RemoveFruitController,
    StoreFruitController,
    UpdateFruitController
]

@Module({
  imports: [
    FruitApplicationModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
        driver: ApolloDriver,
        imports: [FruitApplicationModule],
        inject: [
            CreateFruitUseCase, 
            DeleteFruitUseCase, 
            FindFruitUseCase, 
            ListFruitsUseCase, 
            RemoveFruitUseCase, 
            StoreFruitUseCase, 
            UpdateFruitUseCase, 
        ],
        useFactory: (
            createFruit: CreateFruitUseCase, 
            deleteFruit: DeleteFruitUseCase, 
            findFruit: FindFruitUseCase, 
            listFruits: ListFruitsUseCase,
            removeFruit: RemoveFruitUseCase, 
            storeFruit: StoreFruitUseCase, 
            updateFruit: UpdateFruitUseCase, 
        ) => ({
            schema: fruitSchema,
            context: () => ({
                useCases: { 
                    createFruit, 
                    deleteFruit, 
                    findFruit, 
                    listFruits, 
                    removeFruit, 
                    storeFruit, 
                    updateFruit, 
                },
            }),
        }),
    }),
  ],
  controllers: [...controllers],
  providers: [{ provide: APP_FILTER, useClass: DomainErrorFilter }],
})
export class FruitInterfacesModule {}
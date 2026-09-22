import { CreateFruitUseCase } from "../../application/use-cases/create-fruit.use-case"
import { DeleteFruitUseCase } from "../../application/use-cases/delete-fruit.use-case"
import { FindFruitUseCase } from "../../application/use-cases/find-fruit.use-case"
import { ListFruitsUseCase } from "../../application/use-cases/list-fruits.use-case"
import { RemoveFruitUseCase } from "../../application/use-cases/remove-fruit.use-case"
import { StoreFruitUseCase } from "../../application/use-cases/store-fruit.use-case"
import { UpdateFruitUseCase } from "../../application/use-cases/update-fruit.use-case"

export interface GraphQLContext {
    useCases: {
        createFruit: CreateFruitUseCase,
        deleteFruit: DeleteFruitUseCase,
        findFruit: FindFruitUseCase,
        listFruits: ListFruitsUseCase,
        removeFruit: RemoveFruitUseCase,
        storeFruit: StoreFruitUseCase,
        updateFruit: UpdateFruitUseCase
    }
}
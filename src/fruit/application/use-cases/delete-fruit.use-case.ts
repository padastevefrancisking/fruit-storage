import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "../../../shared/application/use-case";
import { DeleteFruitDTO } from "../dtos/delete-fruit.dto";
import { FRUIT_REPOSITORY } from "../repos/fruit.repository";
import { DomainError, FruitErrorCode } from "../../domain/fruit.errors";
import type { IFruitRepository } from "../repos/fruit.repository";

@Injectable()
export class DeleteFruitUseCase implements UseCase<DeleteFruitDTO, void> {
    constructor(
        @Inject(FRUIT_REPOSITORY) private readonly fruitRepository: IFruitRepository
    ) {}

    async execute(request: DeleteFruitDTO): Promise<void> {
        const fruit = await this.fruitRepository.findByName(request.name);
        
        if (!fruit) {
            throw new DomainError(
                FruitErrorCode.NOT_FOUND,
                `Fruit "${request.name}" was not found.`,
            );
        }

        
        const deletionResult = fruit.delete(request.forceDelete);
        if (deletionResult.isFailure) {
            throw new DomainError(
                FruitErrorCode.CANNOT_DELETE_NON_EMPTY,
                deletionResult.getErrorValue()
            );
        }
        
        await this.fruitRepository.delete(fruit);
    }
}
import { Inject, Injectable } from "@nestjs/common";
import { FruitName } from "./value-objects/fruit-name.vo";
import { FRUIT_REPOSITORY } from "../application/repos/fruit.repository";
import type { IFruitRepository } from "../application/repos/fruit.repository";

@Injectable()
export class FruitUniquenessService{
    constructor(
        @Inject(FRUIT_REPOSITORY) private readonly fruitRepository: IFruitRepository
    ) {}

    public async isUnique(name: FruitName): Promise<boolean> {
        const alreadyExists = await this.fruitRepository.exists(name.value);
        return !alreadyExists;
    }
}
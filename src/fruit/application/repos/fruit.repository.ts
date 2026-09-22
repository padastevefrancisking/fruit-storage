import { Fruit } from "../../domain/fruit.entity";

export const FRUIT_REPOSITORY = Symbol("FRUIT_REPOSITORY");

export interface IFruitRepository {
    exists(name: string): Promise<boolean>;
    findByName(name: string): Promise<Fruit | null>;
    findAll(): Promise<Fruit[]>;
    save(fruit: Fruit): Promise<void>;
    delete(fruit: Fruit): Promise<void>;
};
import { FruitDescription } from "../value-objects/fruit-description";
import { FruitLimitExceededError } from "../errors";

export class Fruit {;
    private currentAmount: number;
    constructor(
        private name: string,
        private description: FruitDescription,
        private limitOfFruitToBeStored: number
    ){
        this.currentAmount = 0;
    }

    public store(amount: number): void {
        if (this.currentAmount + amount > this.limitOfFruitToBeStored) {
            throw new FruitLimitExceededError(`Cannot store ${amount} ${this.name}. Limit of ${this.limitOfFruitToBeStored} exceeded.`);
        }
        this.currentAmount += amount;
    }   

    public update(name: string, description: string, limitOfFruitToBeStored: number): void {
        this.name = name;
        this.description = FruitDescription.create(description);
        this.limitOfFruitToBeStored = limitOfFruitToBeStored;
    }
}
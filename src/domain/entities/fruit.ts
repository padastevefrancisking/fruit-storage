import { FruitDescription } from "../value-objects/fruit-description";
import { FruitLimitExceededError, NegativeFruitLimitError } from "../errors";

export class Fruit {
    public description: FruitDescription;
    public currentAmount: number;
    constructor(
        public name: string,
        description: string,
        public limitOfFruitToBeStored: number
    ){
        this.description = FruitDescription.create(description);

        if (this.limitOfFruitToBeStored < 0) {
            throw new NegativeFruitLimitError('Fruit limit cannot be negative.');
        }
        this.currentAmount = 0;
    }

    public store(amount: number): void {
        if (amount < 0) {
            throw new NegativeFruitLimitError(`Cannot store a negative amount of ${this.name}.`);
        }

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
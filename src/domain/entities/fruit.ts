import { FruitDescription } from "../value-objects/fruit-description";
import { FruitLimitExceededError, NegativeFruitLimitError } from "../errors";

export class Fruit {
    public currentAmount: number;
    constructor(
        public name: string,
        public description: FruitDescription,
        public limitOfFruitToBeStored: number
    ){
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

    public update(name: string, description: FruitDescription, limitOfFruitToBeStored: number): void {
        this.name = name;
        this.description = description;
        this.limitOfFruitToBeStored = limitOfFruitToBeStored;
    }
}
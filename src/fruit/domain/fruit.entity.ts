import { FruitDescription } from "./value-objects/fruit-description.vo";
import { FruitName } from "./value-objects/fruit-name.vo";
import { FruitStock } from "./value-objects/fruit-stock.vo";
import { FruitStorageLimit } from "./value-objects/fruit-storage-limit.vo";
import { AggregateRoot } from "../../shared/domain/aggregate-root";
import { UniqueEntityID } from "../../shared/domain/unique-entity-id";
import { Result } from "../../shared/core/result";
import { Guard } from "../../shared/core/guard";
import { FruitCreatedEvent } from "./events/fruit-created.event";
import { FruitUpdatedEvent } from "./events/fruit-updated.event";
import { FruitDeletedEvent } from "./events/fruit-deleted.event";

interface FruitProps {
    name: FruitName;
    description: FruitDescription;
    limitOfFruitToBeStored: FruitStorageLimit;
    stock: FruitStock;
    createdAt: Date;
    updatedAt: Date;
}

export class Fruit extends AggregateRoot<FruitProps> {
    get name(): FruitName {
        return this.props.name;
    }

    get description(): FruitDescription {
        return this.props.description;
    }

    get limitOfFruitToBeStored(): FruitStorageLimit {
        return this.props.limitOfFruitToBeStored;
    }

    get stock(): FruitStock {
        return this.props.stock;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    private constructor(props: FruitProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: {
        name: FruitName;
        description: FruitDescription;
        limitOfFruitToBeStored: FruitStorageLimit;
        stock?: FruitStock;
        createdAt?: Date;
        updatedAt?: Date;
    }, id?: UniqueEntityID): Result<Fruit> {
        const nullGuardResult = Guard.againstNullOrUndefinedBulk([
            {argument: props.name, argumentName: 'name'},
            {argument: props.description, argumentName: 'description'},
            {argument: props.limitOfFruitToBeStored, argumentName: 'storage limit'}
        ]);

        if (nullGuardResult.isFailure) {
            return Result.fail<Fruit>(nullGuardResult.getErrorValue());
        }

        const isNewFruit = !id;
        const stockResult = props.stock ? Result.ok<FruitStock>(props.stock) : FruitStock.create(0);
        if (stockResult.isFailure) {
            return Result.fail<Fruit>(String(stockResult.getErrorValue()));
        }
        const now = new Date();

        const defaultProps: FruitProps = {
            ...props,
            stock: stockResult.getValue(),
            createdAt: props.createdAt ?? now,
            updatedAt: props.updatedAt ?? now
        }
        const fruit = new Fruit(defaultProps, id);

        if (isNewFruit) {
            fruit.addDomainEvent(new FruitCreatedEvent(fruit));
        }

        return Result.ok<Fruit>(fruit);
    }

    public updateDescription(description: FruitDescription): void {
        this.props.description = description;
        this.props.updatedAt = new Date();
        this.addDomainEvent(new FruitUpdatedEvent(this));
    }

    public updateStorageLimit(limit: FruitStorageLimit): void {
        this.props.limitOfFruitToBeStored = limit;
        this.props.updatedAt = new Date();
        this.addDomainEvent(new FruitUpdatedEvent(this));
    }

    public store(amount: number) : Result<void> {
        const newStockAmount = this.props.stock.value + amount;
        const greaterThanGuardResult = Guard.againstGreaterThan(this.props.limitOfFruitToBeStored.value, newStockAmount);
        if (greaterThanGuardResult.isFailure)
        {
            return Result.fail<void>(greaterThanGuardResult.getErrorValue())
        }

        const newStock = FruitStock.create(newStockAmount);
        if (newStock.isFailure)
        {
            return Result.fail<void>(newStock.getErrorValue());
        }

        this.props.stock = newStock.getValue();
        this.props.updatedAt = new Date();
        this.addDomainEvent(new FruitUpdatedEvent(this));

        return Result.ok<void>();
    }

    public remove(amount: number): Result<void> {
        if (amount <= 0) {
            return Result.fail<void>(`Amount to remove must be a positive integer.`);
        }

        const newStockAmount = this.props.stock.value - amount;
        if (newStockAmount < 0) {
            return Result.fail<void>(`Cannot remove ${amount} fruits. Only ${this.props.stock.value} left in storage.`);
        }

        const newStock = FruitStock.create(newStockAmount);
        if (newStock.isFailure) {
            return Result.fail<void>(newStock.getErrorValue());
        }

        this.props.stock = newStock.getValue();
        this.props.updatedAt = new Date();
        this.addDomainEvent(new FruitUpdatedEvent(this));

        return Result.ok<void>();
    }

    public delete(forceDelete: boolean): Result<void> {
        const currentStock = this.props.stock.value;
        if (currentStock > 0 && !forceDelete) {
            return Result.fail<void>(`Fruit still has ${currentStock} stocks left in storage.`);
        }

        this.addDomainEvent(new FruitDeletedEvent(this));
        return Result.ok<void>();
    }
}
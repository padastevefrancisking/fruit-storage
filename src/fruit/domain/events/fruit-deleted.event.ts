import { IDomainEvent } from "../../../shared/domain/event/i-domain-event";
import { UniqueEntityID } from "../../../shared/domain/unique-entity-id";
import { Fruit } from "../fruit.entity";

export class FruitDeletedEvent implements IDomainEvent {
    public dateTimeOccurred: Date;
    public fruit: Fruit;

    constructor(fruit: Fruit) {
        this.fruit = fruit;
        this.dateTimeOccurred = new Date();
    }

    getAggregateId(): UniqueEntityID {
        return this.fruit.id;
    }

    eventName(): string {
        return 'FruitDeleted';
    }
}
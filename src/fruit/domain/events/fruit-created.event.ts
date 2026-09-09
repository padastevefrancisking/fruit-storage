import { IDomainEvent } from "../../../shared/domain/event/i-domain-event";
import { UniqueEntityID } from "../../../shared/domain/unique-entity-id";
import { Fruit } from "../fruit.entity";

export class FruitCreatedEvent implements IDomainEvent {
    public dateTimeOccurred: Date;
    public fruit: Fruit;

    constructor(fruit: Fruit) {
        this.dateTimeOccurred = new Date();
        this.fruit = fruit;
    }

    getAggregateId(): UniqueEntityID {
        return this.fruit.id;
    }

    eventName(): string {
        return 'FruitCreated';
    }
}
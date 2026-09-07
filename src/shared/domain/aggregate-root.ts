import { Entity } from './entity';
import { UniqueEntityID } from './unique-entity-id';
import { IDomainEvent } from './event/i-domain-event';

export abstract class AggregateRoot<T> extends Entity<T> {
    private _domainEvents: IDomainEvent[] = [];
    
    get id(): UniqueEntityID {
        return this._id;
    }

    get domainEvents(): IDomainEvent[] {
        return this._domainEvents;
    }

    protected addDomainEvent(domainEvent: IDomainEvent): void {
        this._domainEvents.push(domainEvent);
    }

    public clearEvents(): void {
        this._domainEvents = [];
    }
}

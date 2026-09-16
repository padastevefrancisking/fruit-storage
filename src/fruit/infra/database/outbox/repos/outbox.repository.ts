import { ClientSession } from "mongoose";
import { IDomainEvent } from "../../../../../shared/domain/event/domain-event";

export interface IOutboxRecord {
    _id: string;
    aggregateId: string;
    eventName: string;
    payload: Record<string, unknown>;
    isDelivered: boolean;
    attempts: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IOutboxRepository {
    addEvents(events: IDomainEvent[], session?: ClientSession): Promise<void>;
    findUndelivered(limit: number): Promise<IOutboxRecord[]>;
    markDelivered(id: string): Promise<void>;
    incrementAttempts(id: string): Promise<void>;
}
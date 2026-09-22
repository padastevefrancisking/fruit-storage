import { Injectable } from "@nestjs/common";
import { IOutboxRepository } from "../../../../application/repos/outbox.repository";
import type { IOutboxRecord } from "../../../../application/repos/outbox.repository";
import { InjectModel } from "@nestjs/mongoose";
import { OutboxEventDocument } from "../outbox.schema";
import { ClientSession, Model } from "mongoose";
import { IDomainEvent } from "../../../../../shared/domain/event/domain-event";


@Injectable()
export class OutboxRepository implements IOutboxRepository{
    constructor(
        @InjectModel(OutboxEventDocument.name) private readonly outboxModel: Model<OutboxEventDocument>
    ) {}

    public async addEvents(events: IDomainEvent[], session?: ClientSession): Promise<void> {
        if (events.length === 0) return;

        const eventRows = events.map((event) => ({
            aggregateId: event.getAggregateId().toString(),
            eventName: event.eventName(),
            payload: JSON.parse(JSON.stringify(event)),
            isDelivered: false,
            attempts: 0
        }));

        await this.outboxModel.insertMany(eventRows, { session })
    }
    
    public async findUndelivered(limit: number = 50): Promise<IOutboxRecord[]> {
        return this.outboxModel
            .find({ isDelivered: false })
            .sort({ createdAt: 1 })
            .limit(limit)
            .lean<IOutboxRecord[]>();
    }

    public async markDelivered(id: string): Promise<void> {
        await this.outboxModel.updateOne(
            { _id: id },
            { isDelivered: true }
        );
    }

    public async incrementAttempts(id: string): Promise<void> {
        await this.outboxModel.updateOne(
            { _id: id},
            { $inc: 
                { attempts: 1 }
            }
        )
    }
}
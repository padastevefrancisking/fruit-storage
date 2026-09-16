import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type OutboxEventDocumentModel = HydratedDocument<OutboxEventDocument>;

@Schema({collection: 'fruit_event_outbox', timestamps: true})
export class OutboxEventDocument {
    @Prop({required: true, index: true})
    aggregateId!: string;

    @Prop({required: true})
    eventName!: string;

    @Prop({required: true, type: Object})
    payload!: Record<string, unknown>;
    
    @Prop({required: true, default: false, index: true})
    isDelivered!: boolean;

    @Prop({required: true, default: 0})
    attempts!: number;

    @Prop()
    deliveredAt?: Date;

    createdAt?: Date;
    updatedAt?: Date;
}

export const OutboxEventSchema = SchemaFactory.createForClass(OutboxEventDocument);
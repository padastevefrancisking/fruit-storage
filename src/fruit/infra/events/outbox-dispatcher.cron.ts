import { Injectable, Logger } from "@nestjs/common";
import type { IOutboxRepository } from "../database/outbox/repos/outbox.repository";
import { EventPublisher } from "./event-publisher";

@Injectable()
export class OutboxDispatcherCron {
    private readonly logger: Logger = new Logger(OutboxDispatcherCron.name);
    private isRunning : boolean = false;

    constructor(
        private readonly outboxRepository: IOutboxRepository,
        private readonly eventPublisher: EventPublisher
    ) {}

    public async dispatchPendingEvents(): Promise<void> {
        if (this.isRunning) return;
        this.isRunning = true;

        try {
            const undeliveredEvents = await this.outboxRepository.findUndelivered(50);

            for (const event of undeliveredEvents) {
                try {
                    await this.eventPublisher.publish(event.eventName, event.payload);
                    await this.outboxRepository.markDelivered(event._id);
                } catch (error) {
                    await this.outboxRepository.incrementAttempts(event._id);
                    this.logger.error(
                        `Failed to deliver outbox event ${event._id} (${event.eventName}), will retry next tick`,
                        error as Error
                    )
                }
            }
        } finally {
            this.isRunning = false;
        }
    }
}
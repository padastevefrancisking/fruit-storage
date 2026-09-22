import { Inject, Injectable, Logger } from "@nestjs/common";
import { OUTBOX_REPOSITORY } from "../../application/repos/outbox.repository";
import type { IOutboxRepository } from "../../application/repos/outbox.repository";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EVENT_PUBLISHER } from "./event-publisher";
import type { IEventPublisher } from "./event-publisher";

@Injectable()
export class OutboxDispatcherCron {
    private readonly logger: Logger = new Logger(OutboxDispatcherCron.name);
    private isRunning : boolean = false;

    constructor(
        @Inject(OUTBOX_REPOSITORY) private readonly outboxRepository: IOutboxRepository,
        @Inject(EVENT_PUBLISHER) private readonly eventPublisher: IEventPublisher
    ) {}

    @Cron(CronExpression.EVERY_5_MINUTES)
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
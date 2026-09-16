import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class EventPublisher {
    private readonly logger = new Logger(EventPublisher.name);
    
    public async publish(eventName: string, payload: Record<string, unknown>): Promise<void> {
        this.logger.log(
            `Publishing domain event ${eventName}: ${JSON.stringify(payload)}`
        );
    }
}
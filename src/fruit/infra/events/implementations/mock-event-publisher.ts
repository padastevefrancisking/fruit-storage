import { Injectable, Logger } from "@nestjs/common";
import { IEventPublisher } from "../event-publisher";

@Injectable()
export class MockEventPublisher implements IEventPublisher {
    private readonly logger = new Logger(MockEventPublisher.name);
    
    public async publish(eventName: string, payload: Record<string, unknown>): Promise<void> {
        this.logger.log(
            `Publishing domain event ${eventName}: ${JSON.stringify(payload)}`
        );
    }
}
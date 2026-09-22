import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { FruitDocument, FruitSchema } from "./database/fruit.schema";
import { OutboxEventDocument, OutboxEventSchema } from "./database/outbox/outbox.schema";
import { OUTBOX_REPOSITORY } from "../application/repos/outbox.repository";
import { OutboxRepository } from "./database/outbox/implementations/outbox.repository.impl";
import { FRUIT_REPOSITORY } from "../application/repos/fruit.repository";
import { MongooseFruitRepository } from "./database/mongoose-fruit.repository";
import { EVENT_PUBLISHER } from "./events/event-publisher";
import { MockEventPublisher } from "./events/implementations/mock-event-publisher";
import { OutboxDispatcherCron } from "./events/outbox-dispatcher.cron";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        MongooseModule.forFeature([
            { name: FruitDocument.name, schema: FruitSchema },
            { name: OutboxEventDocument.name, schema: OutboxEventSchema }
        ])
    ],
    controllers: [],
    providers: [
        { provide: OUTBOX_REPOSITORY, useClass: OutboxRepository },
        { provide: FRUIT_REPOSITORY, useClass: MongooseFruitRepository },
        { provide: EVENT_PUBLISHER, useClass: MockEventPublisher },
        OutboxDispatcherCron
    ],
    exports: [ FRUIT_REPOSITORY ]
})
export class FruitInfrastructureModule {}
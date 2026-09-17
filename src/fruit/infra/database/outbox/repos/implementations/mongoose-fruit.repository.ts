import { Inject, Injectable } from "@nestjs/common";
import { IFruitRepository } from "../../../../../repos/fruit.repository";
import { Fruit } from "../../../../../domain/fruit.entity";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { FruitDocument } from "../../../fruit.schema";
import { OUTBOX_REPOSITORY } from "../outbox.repository";
import type { IOutboxRepository } from "../outbox.repository";
import { FruitMapper, FruitPersistence } from "../../../../../mappers/fruit.mapper";

@Injectable()
export class MongooseFruitRepository implements IFruitRepository {
    constructor(
        @InjectModel(FruitDocument.name) private readonly fruitModel: Model<FruitDocument>,
        @InjectConnection() private readonly connection: Connection,
        @Inject(OUTBOX_REPOSITORY) private readonly outboxRepository: IOutboxRepository
    ) {}

    public async exists(name: string): Promise<boolean> {
        const doc = await this.fruitModel.exists(
            { name: name.trim().toLowerCase() }
        );

        return doc !== null;
    }

    public async findByName(name: string): Promise<Fruit | null> {
        const raw = await this.fruitModel.findOne(
            { name: name }
        ).lean<FruitPersistence>();

        if (raw === null) { return null; }

        return FruitMapper.toDomain(
            { ...raw, _id: String(raw._id) }
        );
    }

    public async findAll(): Promise<Fruit[]> {
        const rawList = await this.fruitModel.find()
            .lean<FruitPersistence[]>();

        return rawList.map((raw) => (FruitMapper.toDomain(
            { ...raw, _id: String(raw._id) }
        )));
    }

    public async save(fruit: Fruit): Promise<void> {
        const session = await this.connection.startSession();

        try {
            await session.withTransaction(async () => {
                await this.fruitModel.updateOne(
                    { _id: fruit.id.toString() },
                    { $set: FruitMapper.toPersistence(fruit) },
                    { upsert: true, session }
                );
                await this.outboxRepository.addEvents(fruit.domainEvents, session);
            });

            fruit.clearEvents();
        } finally {
            await session.endSession();
        }
    }

    public async delete(fruit: Fruit): Promise<void> {
        const session = await this.connection.startSession();

        try {
            await session.withTransaction(async () => {
                await this.fruitModel.deleteOne(
                    { _id: fruit.id.toString() },
                    { session }
                );
                await this.outboxRepository.addEvents(fruit.domainEvents, session);
            });

            fruit.clearEvents();
        } finally {
            await session.endSession();
        }
    }
}

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type FruitDocument = HydratedDocument<Fruit>;

@Schema()
export class Fruit {
    @Prop({type: String})
    id!: string;

    @Prop({required: true, unique: true, index: true})
    name!: string;

    @Prop({required: true})
    description!: string;

    @Prop({required: true})
    limitOfFruitToBeStored!: number;

    @Prop({required: true, default: 0})
    stock!: number;

    createdAt?: Date;
    updatedAt?: Date;
}

export const FruitSchema = SchemaFactory.createForClass(Fruit);
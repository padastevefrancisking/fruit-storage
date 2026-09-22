import { makeSchema } from "nexus";
import { FruitMutation, FruitQuery, FruitType } from "./fruit.graphql-types";
import { join } from "path";

export const fruitSchema = makeSchema({
    types: [FruitType, FruitQuery, FruitMutation],
    outputs: {
        schema: join(process.cwd(), 'generated', 'schema.graphql'),
        typegen: join(process.cwd(), 'generated', 'nexus-typegenAutoConfig.ts')
    },
    shouldGenerateArtifacts: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test'
})
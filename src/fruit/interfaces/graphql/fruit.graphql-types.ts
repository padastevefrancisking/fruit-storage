import { booleanArg, intArg, mutationType, nonNull, objectType, queryType, stringArg } from "nexus";
import { GraphQLContext } from "./graphql-context";
import { DomainError } from "../../domain/fruit.errors";
import { GraphQLError } from "graphql";

export const FruitType = objectType({
    name: 'Fruit',
    definition(t) {
        t.nonNull.id('id');
        t.nonNull.string('name');
        t.nonNull.string('description');
        t.nonNull.int('limitOfFruitToBeStored');
        t.nonNull.int('stock');
        t.nonNull.string('createdAt', {
            resolve: (fruit: any) => new Date(fruit.createdAt).toISOString()
        });
    },
});

async function runUseCase<T>(fn: () => Promise<T>): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (error instanceof DomainError) {
            throw new GraphQLError(error.message, 
                { extensions: {code: error.code }}
            )
        }
        throw error;
    }
}

export const FruitQuery = queryType({
    definition(t) {
        t.field('findFruit', {
            type: FruitType,
            args: { name: nonNull(stringArg()) },
            resolve: (_root, args, ctx: GraphQLContext) =>
                runUseCase(() => ctx.useCases.findFruit.execute(args))
        });
        
        t.nonNull.list.nonNull.field('listFruits', {
            type: FruitType,
            resolve: (_root, _args, ctx: GraphQLContext) =>
                runUseCase(() => ctx.useCases.listFruits.execute())
        });
    },
})

export const FruitMutation = mutationType({
    definition(t) {
        t.nonNull.field('createFruitForFruitStorage', {
            type: FruitType,
            args: {
                name: nonNull(stringArg()),
                description: nonNull(stringArg()),
                limitOfFruitToBeStored: nonNull(intArg())
            },
            resolve: (_root, args, ctx: GraphQLContext) =>
                runUseCase(() => ctx.useCases.createFruit.execute(args))
        });

        t.nonNull.boolean('deleteFruitFromStorage', {
            args: {
                name: nonNull(stringArg()),
                forceDelete: nonNull(booleanArg())
            },
            resolve: async (_root, args, ctx: GraphQLContext) => {
                await runUseCase(() => ctx.useCases.deleteFruit.execute(args));
                return true;
            }
        });

        t.nonNull.field('removeFruitFromFruitStorage', {
            type: FruitType,
            args: {
                name: nonNull(stringArg()),
                amount: nonNull(intArg())
            },
            resolve: (_root, args, ctx: GraphQLContext) => 
                runUseCase(() => ctx.useCases.removeFruit.execute(args))
        });

        t.nonNull.field('storeFruitToFruitStorage', {
            type: FruitType,
            args: {
                name: nonNull(stringArg()),
                amount: nonNull(intArg())
            },
            resolve: (_root, args, ctx: GraphQLContext) => 
                runUseCase(() => ctx.useCases.storeFruit.execute(args))
        })

        t.nonNull.field('updateFruitFromFruitStorage', {
            type: FruitType,
            args: {
                name: nonNull(stringArg()),
                description: nonNull(stringArg()),
                limitOfFruitToBeStored: nonNull(intArg())
            },
            resolve: (_root, args, ctx: GraphQLContext) =>
                runUseCase(() => ctx.useCases.updateFruit.execute(args))
        });
    }   
})
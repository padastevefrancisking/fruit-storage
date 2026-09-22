import { graphql } from 'graphql';
import { fruitSchema } from './schema';
import { GraphQLContext } from './graphql-context';
import { DomainError, FruitErrorCode } from '../../domain/fruit.errors';
import { FruitDTO } from '../../application/dtos/fruit.dto';

describe('Fruit GraphQL Schema & Resolvers', () => {
    let mockContext: GraphQLContext;
    const sampleDate = new Date('2026-09-22T08:00:00.000Z');

    const sampleFruit: FruitDTO = {
        id: 'fruit-123',
        name: 'Apple',
        description: 'Crisp red apple',
        limitOfFruitToBeStored: 100,
        stock: 10,
        createdAt: sampleDate,
        updatedAt: sampleDate,
    };

    beforeEach(() => {
        mockContext = {
            useCases: {
                createFruit: { execute: jest.fn() } as any,
                deleteFruit: { execute: jest.fn() } as any,
                findFruit: { execute: jest.fn() } as any,
                listFruits: { execute: jest.fn() } as any,
                removeFruit: { execute: jest.fn() } as any,
                storeFruit: { execute: jest.fn() } as any,
                updateFruit: { execute: jest.fn() } as any,
            },
        };
    });

    describe('Queries', () => {
        it('should execute findFruit query successfully', async () => {
            (mockContext.useCases.findFruit.execute as jest.Mock).mockResolvedValue(sampleFruit);

            const source = `
                query FindFruit($name: String!) {
                    findFruit(name: $name) {
                        id
                        name
                        description
                        limitOfFruitToBeStored
                        stock
                        createdAt
                    }
                }
            `;

            const result = await graphql({
                schema: fruitSchema,
                source,
                variableValues: { name: 'Apple' },
                contextValue: mockContext,
            });

            expect(result.errors).toBeUndefined();
            expect(mockContext.useCases.findFruit.execute).toHaveBeenCalledWith({ name: 'Apple' });
            expect(result.data?.findFruit).toEqual({
                id: 'fruit-123',
                name: 'Apple',
                description: 'Crisp red apple',
                limitOfFruitToBeStored: 100,
                stock: 10,
                createdAt: sampleDate.toISOString(),
            });
        });

        it('should return GraphQLError with error code extension when findFruit throws DomainError', async () => {
            (mockContext.useCases.findFruit.execute as jest.Mock).mockRejectedValue(
                new DomainError(FruitErrorCode.NOT_FOUND, 'Fruit "Apple" was not found.')
            );

            const source = `
                query FindFruit($name: String!) {
                    findFruit(name: $name) {
                        id
                        name
                    }
                }
            `;

            const result = await graphql({
                schema: fruitSchema,
                source,
                variableValues: { name: 'Apple' },
                contextValue: mockContext,
            });

            expect(result.errors).toBeDefined();
            expect(result.errors![0].message).toBe('Fruit "Apple" was not found.');
            expect(result.errors![0].extensions?.code).toBe(FruitErrorCode.NOT_FOUND);
        });

        it('should execute listFruits query successfully', async () => {
            (mockContext.useCases.listFruits.execute as jest.Mock).mockResolvedValue([sampleFruit]);

            const source = `
                query ListFruits {
                    listFruits {
                        id
                        name
                        stock
                    }
                }
            `;

            const result = await graphql({
                schema: fruitSchema,
                source,
                contextValue: mockContext,
            });

            expect(result.errors).toBeUndefined();
            expect(mockContext.useCases.listFruits.execute).toHaveBeenCalled();
            expect(result.data?.listFruits).toEqual([
                { id: 'fruit-123', name: 'Apple', stock: 10 },
            ]);
        });
    });

    describe('Mutations', () => {
        it('should execute createFruitForFruitStorage mutation', async () => {
            (mockContext.useCases.createFruit.execute as jest.Mock).mockResolvedValue(sampleFruit);

            const source = `
                mutation CreateFruit($name: String!, $description: String!, $limitOfFruitToBeStored: Int!) {
                    createFruitForFruitStorage(name: $name, description: $description, limitOfFruitToBeStored: $limitOfFruitToBeStored) {
                        id
                        name
                        description
                        limitOfFruitToBeStored
                    }
                }
            `;

            const result = await graphql({
                schema: fruitSchema,
                source,
                variableValues: {
                    name: 'Apple',
                    description: 'Crisp red apple',
                    limitOfFruitToBeStored: 100,
                },
                contextValue: mockContext,
            });

            expect(result.errors).toBeUndefined();
            expect(mockContext.useCases.createFruit.execute).toHaveBeenCalledWith({
                name: 'Apple',
                description: 'Crisp red apple',
                limitOfFruitToBeStored: 100,
            });
            expect(result.data?.createFruitForFruitStorage).toEqual({
                id: 'fruit-123',
                name: 'Apple',
                description: 'Crisp red apple',
                limitOfFruitToBeStored: 100,
            });
        });

        it('should execute deleteFruitFromStorage mutation', async () => {
            (mockContext.useCases.deleteFruit.execute as jest.Mock).mockResolvedValue(undefined);

            const source = `
                mutation DeleteFruit($name: String!, $forceDelete: Boolean!) {
                    deleteFruitFromStorage(name: $name, forceDelete: $forceDelete)
                }
            `;

            const result = await graphql({
                schema: fruitSchema,
                source,
                variableValues: { name: 'Apple', forceDelete: true },
                contextValue: mockContext,
            });

            expect(result.errors).toBeUndefined();
            expect(mockContext.useCases.deleteFruit.execute).toHaveBeenCalledWith({
                name: 'Apple',
                forceDelete: true,
            });
            expect(result.data?.deleteFruitFromStorage).toBe(true);
        });

        it('should execute storeFruitToFruitStorage mutation', async () => {
            const updatedFruit: FruitDTO = { ...sampleFruit, stock: 25 };
            (mockContext.useCases.storeFruit.execute as jest.Mock).mockResolvedValue(updatedFruit);

            const source = `
                mutation StoreFruit($name: String!, $amount: Int!) {
                    storeFruitToFruitStorage(name: $name, amount: $amount) {
                        id
                        name
                        stock
                    }
                }
            `;

            const result = await graphql({
                schema: fruitSchema,
                source,
                variableValues: { name: 'Apple', amount: 15 },
                contextValue: mockContext,
            });

            expect(result.errors).toBeUndefined();
            expect(mockContext.useCases.storeFruit.execute).toHaveBeenCalledWith({
                name: 'Apple',
                amount: 15,
            });
            expect(result.data?.storeFruitToFruitStorage).toEqual({
                id: 'fruit-123',
                name: 'Apple',
                stock: 25,
            });
        });

        it('should execute removeFruitFromFruitStorage mutation', async () => {
            const updatedFruit: FruitDTO = { ...sampleFruit, stock: 5 };
            (mockContext.useCases.removeFruit.execute as jest.Mock).mockResolvedValue(updatedFruit);

            const source = `
                mutation RemoveFruit($name: String!, $amount: Int!) {
                    removeFruitFromFruitStorage(name: $name, amount: $amount) {
                        id
                        name
                        stock
                    }
                }
            `;

            const result = await graphql({
                schema: fruitSchema,
                source,
                variableValues: { name: 'Apple', amount: 5 },
                contextValue: mockContext,
            });

            expect(result.errors).toBeUndefined();
            expect(mockContext.useCases.removeFruit.execute).toHaveBeenCalledWith({
                name: 'Apple',
                amount: 5,
            });
            expect(result.data?.removeFruitFromFruitStorage).toEqual({
                id: 'fruit-123',
                name: 'Apple',
                stock: 5,
            });
        });

        it('should execute updateFruitFromFruitStorage mutation', async () => {
            const updatedFruit: FruitDTO = {
                ...sampleFruit,
                description: 'Updated apple',
                limitOfFruitToBeStored: 200,
            };
            (mockContext.useCases.updateFruit.execute as jest.Mock).mockResolvedValue(updatedFruit);

            const source = `
                mutation UpdateFruit($name: String!, $description: String!, $limitOfFruitToBeStored: Int!) {
                    updateFruitFromFruitStorage(name: $name, description: $description, limitOfFruitToBeStored: $limitOfFruitToBeStored) {
                        id
                        name
                        description
                        limitOfFruitToBeStored
                    }
                }
            `;

            const result = await graphql({
                schema: fruitSchema,
                source,
                variableValues: {
                    name: 'Apple',
                    description: 'Updated apple',
                    limitOfFruitToBeStored: 200,
                },
                contextValue: mockContext,
            });

            expect(result.errors).toBeUndefined();
            expect(mockContext.useCases.updateFruit.execute).toHaveBeenCalledWith({
                name: 'Apple',
                description: 'Updated apple',
                limitOfFruitToBeStored: 200,
            });
            expect(result.data?.updateFruitFromFruitStorage).toEqual({
                id: 'fruit-123',
                name: 'Apple',
                description: 'Updated apple',
                limitOfFruitToBeStored: 200,
            });
        });
    });
});

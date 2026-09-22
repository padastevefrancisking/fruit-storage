import { ListFruitsController } from './list-fruits.controller';
import { ListFruitsUseCase } from '../../../application/use-cases/list-fruits.use-case';
import { FruitDTO } from '../../../application/dtos/fruit.dto';

describe('ListFruitsController', () => {
    let controller: ListFruitsController;
    let mockListFruitsUseCase: jest.Mocked<ListFruitsUseCase>;

    beforeEach(() => {
        mockListFruitsUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<ListFruitsUseCase>;
        controller = new ListFruitsController(mockListFruitsUseCase);
    });

    it('should call ListFruitsUseCase.execute and return list of fruits', async () => {
        const fruits: FruitDTO[] = [
            {
                id: 'fruit-1',
                name: 'Apple',
                description: 'Red apple',
                limitOfFruitToBeStored: 100,
                stock: 10,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 'fruit-2',
                name: 'Banana',
                description: 'Yellow banana',
                limitOfFruitToBeStored: 50,
                stock: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        mockListFruitsUseCase.execute.mockResolvedValue(fruits);

        const result = await controller.handle();

        expect(mockListFruitsUseCase.execute).toHaveBeenCalled();
        expect(result).toEqual(fruits);
    });
});

import { FindFruitController } from './find-fruit.controller';
import { FindFruitUseCase } from '../../../application/use-cases/find-fruit.use-case';
import { FruitDTO } from '../../../application/dtos/fruit.dto';

describe('FindFruitController', () => {
    let controller: FindFruitController;
    let mockFindFruitUseCase: jest.Mocked<FindFruitUseCase>;

    beforeEach(() => {
        mockFindFruitUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<FindFruitUseCase>;
        controller = new FindFruitController(mockFindFruitUseCase);
    });

    it('should call FindFruitUseCase.execute with name param and return the fruit', async () => {
        const expectedFruit: FruitDTO = {
            id: 'fruit-123',
            name: 'Orange',
            description: 'Juicy orange',
            limitOfFruitToBeStored: 50,
            stock: 20,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockFindFruitUseCase.execute.mockResolvedValue(expectedFruit);

        const result = await controller.handle('Orange');

        expect(mockFindFruitUseCase.execute).toHaveBeenCalledWith({ name: 'Orange' });
        expect(result).toEqual(expectedFruit);
    });
});

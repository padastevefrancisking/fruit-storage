import { StoreFruitController } from './store-fruit.controller';
import { StoreFruitUseCase } from '../../../application/use-cases/store-fruit.use-case';
import { FruitDTO } from '../../../application/dtos/fruit.dto';

describe('StoreFruitController', () => {
    let controller: StoreFruitController;
    let mockStoreFruitUseCase: jest.Mocked<StoreFruitUseCase>;

    beforeEach(() => {
        mockStoreFruitUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<StoreFruitUseCase>;
        controller = new StoreFruitController(mockStoreFruitUseCase);
    });

    it('should call StoreFruitUseCase.execute with name param and amount from body', async () => {
        const expectedFruit: FruitDTO = {
            id: 'fruit-123',
            name: 'Mango',
            description: 'Sweet mango',
            limitOfFruitToBeStored: 50,
            stock: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockStoreFruitUseCase.execute.mockResolvedValue(expectedFruit);

        const result = await controller.handle('Mango', { amount: 10 });

        expect(mockStoreFruitUseCase.execute).toHaveBeenCalledWith({
            name: 'Mango',
            amount: 10,
        });
        expect(result).toEqual(expectedFruit);
    });
});

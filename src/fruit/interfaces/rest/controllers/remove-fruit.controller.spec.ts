import { RemoveFruitController } from './remove-fruit.controller';
import { RemoveFruitUseCase } from '../../../application/use-cases/remove-fruit.use-case';
import { FruitDTO } from '../../../application/dtos/fruit.dto';

describe('RemoveFruitController', () => {
    let controller: RemoveFruitController;
    let mockRemoveFruitUseCase: jest.Mocked<RemoveFruitUseCase>;

    beforeEach(() => {
        mockRemoveFruitUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<RemoveFruitUseCase>;
        controller = new RemoveFruitController(mockRemoveFruitUseCase);
    });

    it('should call RemoveFruitUseCase.execute with name param and amount from body', async () => {
        const expectedFruit: FruitDTO = {
            id: 'fruit-123',
            name: 'Apple',
            description: 'Red apple',
            limitOfFruitToBeStored: 100,
            stock: 15,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockRemoveFruitUseCase.execute.mockResolvedValue(expectedFruit);

        const result = await controller.handle('Apple', { amount: 5 });

        expect(mockRemoveFruitUseCase.execute).toHaveBeenCalledWith({
            name: 'Apple',
            amount: 5,
        });
        expect(result).toEqual(expectedFruit);
    });
});

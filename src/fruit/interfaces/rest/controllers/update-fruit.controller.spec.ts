import { UpdateFruitController } from './update-fruit.controller';
import { UpdateFruitUseCase } from '../../../application/use-cases/update-fruit.use-case';
import { FruitDTO } from '../../../application/dtos/fruit.dto';

describe('UpdateFruitController', () => {
    let controller: UpdateFruitController;
    let mockUpdateFruitUseCase: jest.Mocked<UpdateFruitUseCase>;

    beforeEach(() => {
        mockUpdateFruitUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<UpdateFruitUseCase>;
        controller = new UpdateFruitController(mockUpdateFruitUseCase);
    });

    it('should call UpdateFruitUseCase.execute with name param and update dto', async () => {
        const dto = {
            description: 'Updated green apple',
            limitOfFruitToBeStored: 150,
        };

        const expectedFruit: FruitDTO = {
            id: 'fruit-123',
            name: 'Apple',
            description: 'Updated green apple',
            limitOfFruitToBeStored: 150,
            stock: 20,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockUpdateFruitUseCase.execute.mockResolvedValue(expectedFruit);

        const result = await controller.handle('Apple', dto);

        expect(mockUpdateFruitUseCase.execute).toHaveBeenCalledWith({
            name: 'Apple',
            ...dto,
        });
        expect(result).toEqual(expectedFruit);
    });
});

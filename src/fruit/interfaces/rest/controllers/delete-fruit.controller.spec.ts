import { DeleteFruitController } from './delete-fruit.controller';
import { DeleteFruitUseCase } from '../../../application/use-cases/delete-fruit.use-case';

describe('DeleteFruitController', () => {
    let controller: DeleteFruitController;
    let mockDeleteFruitUseCase: jest.Mocked<DeleteFruitUseCase>;

    beforeEach(() => {
        mockDeleteFruitUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<DeleteFruitUseCase>;
        controller = new DeleteFruitController(mockDeleteFruitUseCase);
    });

    it('should call DeleteFruitUseCase.execute with forceDelete true when query param is "true"', async () => {
        mockDeleteFruitUseCase.execute.mockResolvedValue(undefined);

        await controller.handle('Apple', 'true');

        expect(mockDeleteFruitUseCase.execute).toHaveBeenCalledWith({
            name: 'Apple',
            forceDelete: true,
        });
    });

    it('should call DeleteFruitUseCase.execute with forceDelete false when query param is omitted or false', async () => {
        mockDeleteFruitUseCase.execute.mockResolvedValue(undefined);

        await controller.handle('Banana', undefined);

        expect(mockDeleteFruitUseCase.execute).toHaveBeenCalledWith({
            name: 'Banana',
            forceDelete: false,
        });

        await controller.handle('Banana', 'false');

        expect(mockDeleteFruitUseCase.execute).toHaveBeenCalledWith({
            name: 'Banana',
            forceDelete: false,
        });
    });
});

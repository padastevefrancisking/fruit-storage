import { CreateFruitController } from './create-fruit.controller';
import { CreateFruitUseCase } from '../../../application/use-cases/create-fruit.use-case';
import { FruitDTO } from '../../../application/dtos/fruit.dto';

describe('CreateFruitController', () => {
    let controller: CreateFruitController;
    let mockCreateFruitUseCase: jest.Mocked<CreateFruitUseCase>;

    beforeEach(() => {
        mockCreateFruitUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<CreateFruitUseCase>;
        controller = new CreateFruitController(mockCreateFruitUseCase);
    });

    it('should call CreateFruitUseCase.execute with the request DTO and return the result', async () => {
        const dto = {
            name: 'Apple',
            description: 'Crisp red apple',
            limitOfFruitToBeStored: 100,
        };

        const expectedResult: FruitDTO = {
            id: 'fruit-123',
            name: 'Apple',
            description: 'Crisp red apple',
            limitOfFruitToBeStored: 100,
            stock: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockCreateFruitUseCase.execute.mockResolvedValue(expectedResult);

        const result = await controller.handle(dto);

        expect(mockCreateFruitUseCase.execute).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
    });
});

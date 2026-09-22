import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateFruitRequestDTO } from './create-fruit.request-dto';
import { DeleteFruitRequestDTO } from './delete-fruit.request-dto';
import { RemoveFruitRequestDTO } from './remove-fruit.request-dto';
import { StoreFruitRequestDTO } from './store-fruit.request-dto';
import { UpdateFruitRequestDTO } from './update-fruit.request-dto';

describe('REST Request DTOs Validation', () => {
    describe('CreateFruitRequestDTO', () => {
        it('should pass validation with valid data', async () => {
            const dto = plainToInstance(CreateFruitRequestDTO, {
                name: 'Apple',
                description: 'A delicious apple',
                limitOfFruitToBeStored: 100,
            });

            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should fail validation when name or description are missing or not strings', async () => {
            const dto = plainToInstance(CreateFruitRequestDTO, {
                name: 123,
                description: null,
                limitOfFruitToBeStored: 50,
            });

            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            const properties = errors.map((e) => e.property);
            expect(properties).toContain('name');
            expect(properties).toContain('description');
        });

        it('should fail validation when limitOfFruitToBeStored is negative or not an int', async () => {
            const dto = plainToInstance(CreateFruitRequestDTO, {
                name: 'Apple',
                description: 'A delicious apple',
                limitOfFruitToBeStored: -10,
            });

            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].property).toBe('limitOfFruitToBeStored');
        });

        it('should fail validation when limitOfFruitToBeStored is 0', async () => {
            const dto = plainToInstance(CreateFruitRequestDTO, {
                name: 'Apple',
                description: 'A delicious apple',
                limitOfFruitToBeStored: 0,
            });

            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].property).toBe('limitOfFruitToBeStored');
        });
    });

    describe('DeleteFruitRequestDTO', () => {
        it('should pass validation when forceDelete is boolean', async () => {
            const dto = plainToInstance(DeleteFruitRequestDTO, { forceDelete: true });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should fail validation when forceDelete is not a boolean', async () => {
            const dto = plainToInstance(DeleteFruitRequestDTO, { forceDelete: 'not-a-bool' });
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].property).toBe('forceDelete');
        });
    });

    describe('StoreFruitRequestDTO', () => {
        it('should pass validation with positive integer amount', async () => {
            const dto = plainToInstance(StoreFruitRequestDTO, { amount: 15 });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should fail validation when amount is zero, negative, or not an integer', async () => {
            const zeroDto = plainToInstance(StoreFruitRequestDTO, { amount: 0 });
            const negativeDto = plainToInstance(StoreFruitRequestDTO, { amount: -5 });
            const decimalDto = plainToInstance(StoreFruitRequestDTO, { amount: 3.14 });

            expect((await validate(zeroDto)).length).toBeGreaterThan(0);
            expect((await validate(negativeDto)).length).toBeGreaterThan(0);
            expect((await validate(decimalDto)).length).toBeGreaterThan(0);
        });
    });

    describe('RemoveFruitRequestDTO', () => {
        it('should pass validation with positive integer amount', async () => {
            const dto = plainToInstance(RemoveFruitRequestDTO, { amount: 10 });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should fail validation when amount is non-positive or not integer', async () => {
            const dto = plainToInstance(RemoveFruitRequestDTO, { amount: -1 });
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].property).toBe('amount');
        });
    });

    describe('UpdateFruitRequestDTO', () => {
        it('should pass validation with valid data', async () => {
            const dto = plainToInstance(UpdateFruitRequestDTO, {
                description: 'Updated apple description',
                limitOfFruitToBeStored: 200,
            });
            const errors = await validate(dto);
            expect(errors.length).toBe(0);
        });

        it('should fail validation when description is missing or limit is non-positive', async () => {
            const dto = plainToInstance(UpdateFruitRequestDTO, {
                description: 123,
                limitOfFruitToBeStored: -1,
            });
            const errors = await validate(dto);
            expect(errors.length).toBeGreaterThan(0);
        });
    });
});

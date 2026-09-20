import { IsInt, IsPositive } from "class-validator";

export class StoreFruitRequestDTO {
    @IsInt()
    @IsPositive()
    amount: number;
}
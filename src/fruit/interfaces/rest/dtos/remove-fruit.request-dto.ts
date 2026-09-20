import { IsPositive, IsInt } from "class-validator";

export class RemoveFruitRequestDTO {
    @IsInt()
    @IsPositive()
    amount: number;
}
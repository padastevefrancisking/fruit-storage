import { IsInt, IsPositive, IsString } from "class-validator";

export class UpdateFruitRequestDTO {
    @IsString()
    description: string;

    @IsInt()
    @IsPositive()
    limitOfFruitToBeStored: number;
}
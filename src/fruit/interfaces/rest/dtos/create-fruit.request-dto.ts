import { IsInt, IsPositive, IsString } from "class-validator";

export class CreateFruitRequestDTO {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsInt()
    @IsPositive()
    limitOfFruitToBeStored: number;
}
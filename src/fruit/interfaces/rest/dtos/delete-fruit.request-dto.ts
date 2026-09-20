import { IsBoolean } from "class-validator";

export class DeleteFruitRequestDTO {
    @IsBoolean()
    forceDelete: boolean;
}
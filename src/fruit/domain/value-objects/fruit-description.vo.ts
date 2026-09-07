import { ValueObject } from "../../../shared/domain/value-object";
import { Result } from "../../../shared/core/result";
import { Guard } from "../../../shared/core/guard";

export interface FruitDescriptionProps {
    value: string
}

export class FruitDescription extends ValueObject<FruitDescriptionProps> {
    private static readonly MAX_LENGTH : number = 30;
    get value() : string {
        return this.props.value;
    }

    private constructor(props: FruitDescriptionProps) {
        super(props);
    }

    public static create(description: string): Result<FruitDescription> {
        const argName = 'description';

        const nullGuardResponse = Guard.againstNullOrUndefined(description, argName);
        if(nullGuardResponse.isFailure)
        {
            return Result.fail<FruitDescription>(nullGuardResponse.getErrorValue());
        }

        const emptyGuardResponse = Guard.againstEmptyString(description, argName);
        if(emptyGuardResponse.isFailure)
        {
            return Result.fail<FruitDescription>(emptyGuardResponse.getErrorValue());
        }

        const trimmed = description.trim();
        if (trimmed.length > this.MAX_LENGTH) {
            return Result.fail<FruitDescription>(
                `Description exceeded more than ${this.MAX_LENGTH} characters. Current description is ${trimmed.length} long.`
            );
        }

        return Result.ok<FruitDescription>(new FruitDescription({
            value: trimmed
        }));
    }
}
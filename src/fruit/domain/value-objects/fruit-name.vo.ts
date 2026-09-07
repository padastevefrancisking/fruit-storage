import { ValueObject } from "../../../shared/domain/value-object";
import { Result } from "../../../shared/core/result";
import { Guard } from "../../../shared/core/guard";

export interface FruitNameProps {
    value: string;
}

export class FruitName extends ValueObject<FruitNameProps> {
    get value() : string {
        return this.props.value;
    }

    private constructor(props: FruitNameProps) {
        super(props);
    }

    public static create(name: string): Result<FruitName> {
        const nullGuardResult = Guard.againstNullOrUndefined(name, 'name');
        if (nullGuardResult.isFailure)
        {
            return Result.fail<FruitName>(nullGuardResult.getErrorValue());
        }
        
        const emptyGuardResult = Guard.againstEmptyString(name, `name`);
        if (emptyGuardResult.isFailure)
        {
            return Result.fail<FruitName>(emptyGuardResult.getErrorValue());
        }

        return Result.ok<FruitName>(new FruitName({
            value: name.trim()
        }))
    }
}
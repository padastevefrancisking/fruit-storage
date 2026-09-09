import { ValueObject } from "../../../shared/domain/value-object";
import { Result } from "../../../shared/core/result";
import { Guard } from "../../../shared/core/guard";

interface FruitStorageLimitProps {
    value: number
}

export class FruitStorageLimit extends ValueObject<FruitStorageLimitProps> {
    get value(): number {
        return this.props.value;
    }

    private constructor(props: FruitStorageLimitProps) {
        super(props);
    }

    public static create(amount: number): Result<FruitStorageLimit> {
        const argumentName = 'Fruit storage limit';

        const nullGuardResult = Guard.againstNullOrUndefined(amount, argumentName);
        if (nullGuardResult.isFailure) {
            return Result.fail<FruitStorageLimit>(nullGuardResult.getErrorValue());
        }

        const positiveGuardResult = Guard.isPositiveNumber(amount, argumentName);
        if(positiveGuardResult.isFailure) {
            return Result.fail<FruitStorageLimit>(positiveGuardResult.getErrorValue());
        }

        return Result.ok<FruitStorageLimit>(new FruitStorageLimit({
            value: amount
        }))
    }
}
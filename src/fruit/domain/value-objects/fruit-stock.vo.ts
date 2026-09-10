import { ValueObject } from "../../../shared/domain/value-object";
import { Result } from "../../../shared/core/result";
import { Guard } from "../../../shared/core/guard";

interface FruitStockProps {
    value: number
}

export class FruitStock extends ValueObject<FruitStockProps> {
    get value(): number {
        return this.props.value;
    }

    private constructor(props: FruitStockProps) {
        super(props);
    }

    public static create(amount: number): Result<FruitStock> {
        const argumentName = 'Fruit stock';

        const nullGuardResult = Guard.againstNullOrUndefined(amount, argumentName);
        if (nullGuardResult.isFailure) {
            return Result.fail<FruitStock>(nullGuardResult.getErrorValue())
        }

        const negativeGuardResult = Guard.againstNegativeNumber(amount, argumentName);
        if (negativeGuardResult.isFailure) {
            return Result.fail<FruitStock>(negativeGuardResult.getErrorValue());
        }

        return Result.ok<FruitStock>(new FruitStock({value: amount}));
    }
}
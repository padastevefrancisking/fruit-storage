import { Result } from './result';

export interface IGuardArgument {
    argument: any;
    argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];
export type GuardResponse = string;

export class Guard {
    public static combine(guardResults: Result<any>[]): Result<GuardResponse> {
        for (let result of guardResults) {
            if (result.isFailure) return result;
        }

        return Result.ok<GuardResponse>();
    }

    public static isGreaterThan(minValue: number, actualValue: number): Result<GuardResponse> {
        return actualValue > minValue
            ? Result.ok<GuardResponse>()
            : Result.fail<GuardResponse>(`Value is not greater than ${minValue}`);
    }

    public static isPositiveNumber(argument: number, argumentName: string): Result<GuardResponse> {
        return (!Number.isInteger(argument) || argument <= 0)
            ? Result.fail<GuardResponse>(`${argumentName} is not a positive integer.`)
            : Result.ok<GuardResponse>();
    }

    public static againstAtLeast(numChars: number, text: string): Result<GuardResponse> {
        return text.length >= numChars
            ? Result.ok<GuardResponse>()
            : Result.fail<GuardResponse>(`Text is not at least ${numChars} characters.`);
    }

    public static againstNullOrUndefined(argument: any, argumentName: string): Result<GuardResponse> {
       return argument === null || argument === undefined
            ? Result.fail<GuardResponse>(`${argumentName} is null or undefined.`)
            : Result.ok<GuardResponse>();
    }

    public static againstEmptyString(argument: string, argumentName: string): Result<GuardResponse> {
        return argument.trim().length === 0
            ? Result.fail<GuardResponse>(`${argumentName} is an empty string.`)
            : Result.ok<GuardResponse>();
    }

    public static againstNegativeNumber(argument: number, argumentName: string): Result<GuardResponse> {
        return argument > 0
            ? Result.fail<GuardResponse>(`${argumentName} is negative.`)
            : Result.ok<GuardResponse>();
    }
}
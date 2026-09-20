import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { DomainError, FruitErrorCode } from "../../domain/fruit.errors";

const STATUS_BY_CODE: Record<FruitErrorCode, HttpStatus> = {
    [FruitErrorCode.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [FruitErrorCode.NAME_ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [FruitErrorCode.INVALID_DESCRIPTION]: HttpStatus.BAD_REQUEST,
    [FruitErrorCode.INVALID_NAME]: HttpStatus.BAD_REQUEST,
    [FruitErrorCode.INVALID_LIMIT]: HttpStatus.BAD_REQUEST,
    [FruitErrorCode.INVALID_AMOUNT]: HttpStatus.BAD_REQUEST,
    [FruitErrorCode.STORAGE_LIMIT_EXCEEDED]: HttpStatus.CONFLICT,
    [FruitErrorCode.INSUFFICIENT_STOCK]: HttpStatus.CONFLICT,
    [FruitErrorCode.CANNOT_DELETE_NON_EMPTY]: HttpStatus.CONFLICT
};

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
    catch(exception: DomainError, host: ArgumentsHost) {
        const status = STATUS_BY_CODE[exception.code] ?? HttpStatus.BAD_REQUEST;

        throw new HttpException(
            { code: exception.code, message: exception.message },
        status);
    }
}
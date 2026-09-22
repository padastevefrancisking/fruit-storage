export const Injectable = () => (target: any) => target;
export const Inject = (token?: any) => (target: any, key?: any, index?: number) => {};
export const Module = (metadata?: any) => (target: any) => target;
export const Controller = (prefix?: any) => (target: any) => target;
export const Res = () => () => {};
export const Req = () => () => {};
export const Param = () => () => {};
export const Body = () => () => {};
export const Query = () => () => {};
export const Headers = () => () => {};
export const Header = () => () => {};
export const HttpCode = () => () => {};
export const Get = (path?: any) => (target: any, key?: any, descriptor?: any) => descriptor;
export const Post = (path?: any) => (target: any, key?: any, descriptor?: any) => descriptor;
export const Put = (path?: any) => (target: any, key?: any, descriptor?: any) => descriptor;
export const Delete = (path?: any) => (target: any, key?: any, descriptor?: any) => descriptor;
export const Patch = (path?: any) => (target: any, key?: any, descriptor?: any) => descriptor;
export const Catch = (...exceptions: any[]) => (target: any) => target;
export class HttpException extends Error {
    constructor(public readonly response: any, public readonly status: number) {
        super(typeof response === 'string' ? response : (response?.message ?? 'Http Exception'));
    }
    getStatus(): number {
        return this.status;
    }
    getResponse(): any {
        return this.response;
    }
}
export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};
export const Scope = { DEFAULT: 0, TRANSIENT: 1, REQUEST: 2 };
export const Optional = () => () => {};
export const SetMetadata = () => () => {};
export class Logger {
    constructor(public readonly context?: string) {}
    log(...args: any[]) {}
    error(...args: any[]) {}
    warn(...args: any[]) {}
    debug(...args: any[]) {}
    verbose(...args: any[]) {}
}

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
export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
export const Scope = { DEFAULT: 0, TRANSIENT: 1, REQUEST: 2 };
export const Optional = () => () => {};
export const SetMetadata = () => () => {};

export const InjectModel = (model?: any) => (target: any, key?: any, index?: number) => {};
export const InjectConnection = (name?: string) => (target: any, key?: any, index?: number) => {};
export const Prop = (options?: any) => (target: any, propertyKey?: string) => {};
export const Schema = (options?: any) => (target: any) => target;
export const SchemaFactory = {
    createForClass: (target: any) => ({}),
};

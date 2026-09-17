export const Cron = (cronTime?: any, options?: any) => (target: any, key?: any, descriptor?: any) => descriptor;

export const CronExpression = {
    EVERY_SECOND: '* * * * * *',
    EVERY_5_SECONDS: '*/5 * * * * *',
    EVERY_10_SECONDS: '*/10 * * * * *',
    EVERY_30_SECONDS: '*/30 * * * * *',
    EVERY_MINUTE: '*/1 * * * *',
    EVERY_5_MINUTES: '0 */5 * * * *',
    EVERY_10_MINUTES: '0 */10 * * * *',
    EVERY_30_MINUTES: '0 */30 * * * *',
    EVERY_HOUR: '0 0-23/1 * * *',
    EVERY_DAY_AT_MIDNIGHT: '0 0 * * *',
};

export const ScheduleModule = {
    forRoot: () => ({
        module: class ScheduleModule {},
        providers: [],
        exports: [],
    }),
};

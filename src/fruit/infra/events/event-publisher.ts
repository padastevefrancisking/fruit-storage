export const EVENT_PUBLISHER = Symbol("EVENT_PUBLISHER")

export interface IEventPublisher {
    publish(eventName: string, payload: Record<string, unknown>): Promise<void>;
}
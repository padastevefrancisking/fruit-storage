import { MockEventPublisher } from './mock-event-publisher';
import { Logger } from '@nestjs/common';

describe('MockEventPublisher', () => {
    let publisher: MockEventPublisher;

    beforeEach(() => {
        publisher = new MockEventPublisher();
    });

    it('should log published domain event with eventName and stringified payload', async () => {
        const logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();

        await publisher.publish('FruitCreatedEvent', { id: 'fruit-1', name: 'Apple' });

        expect(logSpy).toHaveBeenCalledWith(
            'Publishing domain event FruitCreatedEvent: {"id":"fruit-1","name":"Apple"}'
        );

        logSpy.mockRestore();
    });
});

import { OutboxDispatcherCron } from './outbox-dispatcher.cron';
import { IOutboxRepository, IOutboxRecord } from '../../application/repos/outbox.repository';
import { MockEventPublisher } from './implementations/mock-event-publisher';
import { Logger } from '@nestjs/common';

describe('OutboxDispatcherCron', () => {
    let cron: OutboxDispatcherCron;
    let mockOutboxRepo: jest.Mocked<IOutboxRepository>;
    let mockPublisher: jest.Mocked<MockEventPublisher>;

    beforeEach(() => {
        mockOutboxRepo = {
            addEvents: jest.fn(),
            findUndelivered: jest.fn(),
            markDelivered: jest.fn(),
            incrementAttempts: jest.fn(),
        };

        mockPublisher = {
            publish: jest.fn(),
        } as unknown as jest.Mocked<MockEventPublisher>;

        cron = new OutboxDispatcherCron(mockOutboxRepo, mockPublisher);
    });

    it('should dispatch pending events and mark them as delivered', async () => {
        const events: IOutboxRecord[] = [
            {
                _id: 'evt-1',
                aggregateId: 'agg-1',
                eventName: 'FruitCreatedEvent',
                payload: { name: 'Apple' },
                isDelivered: false,
                attempts: 0,
            },
            {
                _id: 'evt-2',
                aggregateId: 'agg-2',
                eventName: 'FruitStockStoredEvent',
                payload: { name: 'Apple', amount: 5 },
                isDelivered: false,
                attempts: 0,
            },
        ];

        mockOutboxRepo.findUndelivered.mockResolvedValue(events);
        mockPublisher.publish.mockResolvedValue(undefined);
        mockOutboxRepo.markDelivered.mockResolvedValue(undefined);

        await cron.dispatchPendingEvents();

        expect(mockOutboxRepo.findUndelivered).toHaveBeenCalledWith(50);
        expect(mockPublisher.publish).toHaveBeenCalledTimes(2);
        expect(mockPublisher.publish).toHaveBeenNthCalledWith(1, 'FruitCreatedEvent', { name: 'Apple' });
        expect(mockPublisher.publish).toHaveBeenNthCalledWith(2, 'FruitStockStoredEvent', { name: 'Apple', amount: 5 });
        expect(mockOutboxRepo.markDelivered).toHaveBeenCalledWith('evt-1');
        expect(mockOutboxRepo.markDelivered).toHaveBeenCalledWith('evt-2');
    });

    it('should increment attempts and log error when publishing an event fails', async () => {
        const event: IOutboxRecord = {
            _id: 'evt-fail',
            aggregateId: 'agg-1',
            eventName: 'FruitCreatedEvent',
            payload: { name: 'Apple' },
            isDelivered: false,
            attempts: 0,
        };

        const publishError = new Error('Publishing failed');
        mockOutboxRepo.findUndelivered.mockResolvedValue([event]);
        mockPublisher.publish.mockRejectedValue(publishError);
        mockOutboxRepo.incrementAttempts.mockResolvedValue(undefined);

        const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();

        await cron.dispatchPendingEvents();

        expect(mockOutboxRepo.incrementAttempts).toHaveBeenCalledWith('evt-fail');
        expect(mockOutboxRepo.markDelivered).not.toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledWith(
            'Failed to deliver outbox event evt-fail (FruitCreatedEvent), will retry next tick',
            publishError
        );

        errorSpy.mockRestore();
    });

    it('should prevent concurrent execution when already running', async () => {
        let resolvePromise: (value: IOutboxRecord[]) => void;
        const pendingPromise = new Promise<IOutboxRecord[]>((resolve) => {
            resolvePromise = resolve;
        });

        mockOutboxRepo.findUndelivered.mockReturnValue(pendingPromise);

        // First invocation begins and holds isRunning = true
        const firstCall = cron.dispatchPendingEvents();

        // Second invocation during first execution should return immediately
        await cron.dispatchPendingEvents();

        expect(mockOutboxRepo.findUndelivered).toHaveBeenCalledTimes(1);

        // Finish first execution
        resolvePromise!([]);
        await firstCall;

        // Subsequent call after finish should now run
        mockOutboxRepo.findUndelivered.mockResolvedValue([]);
        await cron.dispatchPendingEvents();
        expect(mockOutboxRepo.findUndelivered).toHaveBeenCalledTimes(2);
    });
});

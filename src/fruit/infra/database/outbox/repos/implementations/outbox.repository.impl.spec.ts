import { OutboxRepository } from './outbox.repository.impl';
import { Model, ClientSession } from 'mongoose';
import { OutboxEventDocument } from '../../outbox.schema';
import { IDomainEvent } from '../../../../../../shared/domain/event/domain-event';
import { UniqueEntityID } from '../../../../../../shared/domain/unique-entity-id';

describe('OutboxRepository', () => {
    let repository: OutboxRepository;
    let mockOutboxModel: Partial<Record<keyof Model<OutboxEventDocument>, jest.Mock>>;

    beforeEach(() => {
        mockOutboxModel = {
            insertMany: jest.fn(),
            find: jest.fn(),
            updateOne: jest.fn(),
        };

        repository = new OutboxRepository(mockOutboxModel as unknown as Model<OutboxEventDocument>);
    });

    describe('addEvents', () => {
        it('should do nothing if events array is empty', async () => {
            await repository.addEvents([]);

            expect(mockOutboxModel.insertMany).not.toHaveBeenCalled();
        });

        it('should map domain events and insert them with the provided session', async () => {
            const mockEvent: IDomainEvent = {
                dateTimeOccurred: new Date('2026-01-01T00:00:00Z'),
                getAggregateId: () => new UniqueEntityID('aggregate-123'),
                eventName: () => 'FruitCreatedEvent',
            };

            const mockSession = {} as ClientSession;
            (mockOutboxModel.insertMany as jest.Mock).mockResolvedValueOnce([]);

            await repository.addEvents([mockEvent], mockSession);

            expect(mockOutboxModel.insertMany).toHaveBeenCalledTimes(1);
            expect(mockOutboxModel.insertMany).toHaveBeenCalledWith(
                [
                    {
                        aggregateId: 'aggregate-123',
                        eventName: 'FruitCreatedEvent',
                        payload: expect.any(Object),
                        isDelivered: false,
                        attempts: 0,
                    },
                ],
                { session: mockSession }
            );
        });
    });

    describe('findUndelivered', () => {
        it('should query undelivered events sorted by createdAt ascending with limit and lean', async () => {
            const mockRecords = [
                {
                    _id: 'record-1',
                    aggregateId: 'agg-1',
                    eventName: 'FruitCreatedEvent',
                    payload: {},
                    isDelivered: false,
                    attempts: 0,
                },
            ];

            const leanMock = jest.fn().mockResolvedValue(mockRecords);
            const limitMock = jest.fn().mockReturnValue({ lean: leanMock });
            const sortMock = jest.fn().mockReturnValue({ limit: limitMock });
            (mockOutboxModel.find as jest.Mock).mockReturnValue({ sort: sortMock });

            const result = await repository.findUndelivered(20);

            expect(mockOutboxModel.find).toHaveBeenCalledWith({ isDelivered: false });
            expect(sortMock).toHaveBeenCalledWith({ createdAt: 1 });
            expect(limitMock).toHaveBeenCalledWith(20);
            expect(result).toEqual(mockRecords);
        });

        it('should default limit to 50 when not specified', async () => {
            const leanMock = jest.fn().mockResolvedValue([]);
            const limitMock = jest.fn().mockReturnValue({ lean: leanMock });
            const sortMock = jest.fn().mockReturnValue({ limit: limitMock });
            (mockOutboxModel.find as jest.Mock).mockReturnValue({ sort: sortMock });

            await repository.findUndelivered();

            expect(limitMock).toHaveBeenCalledWith(50);
        });
    });

    describe('markDelivered', () => {
        it('should update event document to isDelivered: true', async () => {
            (mockOutboxModel.updateOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true });

            await repository.markDelivered('event-id-123');

            expect(mockOutboxModel.updateOne).toHaveBeenCalledWith(
                { _id: 'event-id-123' },
                { isDelivered: true }
            );
        });
    });

    describe('incrementAttempts', () => {
        it('should increment attempts by 1', async () => {
            (mockOutboxModel.updateOne as jest.Mock).mockResolvedValueOnce({ acknowledged: true });

            await repository.incrementAttempts('event-id-123');

            expect(mockOutboxModel.updateOne).toHaveBeenCalledWith(
                { _id: 'event-id-123' },
                { $inc: { attempts: 1 } }
            );
        });
    });
});

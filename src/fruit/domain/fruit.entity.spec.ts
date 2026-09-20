import { Fruit } from './fruit.entity';
import { FruitName } from './value-objects/fruit-name.vo';
import { FruitDescription } from './value-objects/fruit-description.vo';
import { FruitStorageLimit } from './value-objects/fruit-storage-limit.vo';
import { FruitCreatedEvent } from './events/fruit-created.event';
import { FruitUpdatedEvent } from './events/fruit-updated.event';
import { FruitDeletedEvent } from './events/fruit-deleted.event';
import { UniqueEntityID } from '../../shared/domain/unique-entity-id';

describe('Fruit Entity', () => {
    const createValidProps = () => ({
        name: FruitName.create('Apple').getValue(),
        description: FruitDescription.create('A crisp red fruit').getValue(),
        limitOfFruitToBeStored: FruitStorageLimit.create(100).getValue(),
    });

    // ─── Creation ─────────────────────────────────────────────────────────────

    it('should create a valid Fruit entity with default stock of 0', () => {
        const result = Fruit.create(createValidProps());
        expect(result.isSuccess).toBe(true);

        const fruit = result.getValue();
        expect(fruit.name.value).toBe('Apple');
        expect(fruit.description.value).toBe('A crisp red fruit');
        expect(fruit.limitOfFruitToBeStored.value).toBe(100);
        expect(fruit.stock.value).toBe(0);
        expect(fruit.createdAt).toBeInstanceOf(Date);
        expect(fruit.updatedAt).toBeInstanceOf(Date);
    });

    it('should add FruitCreatedEvent when creating a new fruit without id', () => {
        const fruit = Fruit.create(createValidProps()).getValue();
        expect(fruit.domainEvents).toHaveLength(1);
        expect(fruit.domainEvents[0]).toBeInstanceOf(FruitCreatedEvent);
    });

    it('should not add FruitCreatedEvent when reconstituting with an existing id', () => {
        const id = new UniqueEntityID('existing-id-123');
        const fruit = Fruit.create(createValidProps(), id).getValue();
        expect(fruit.domainEvents).toHaveLength(0);
        expect(fruit.id.toString()).toBe('existing-id-123');
    });

    it('should fail creation when null name or description is provided', () => {
        const result = Fruit.create({
            name: null as any,
            description: FruitDescription.create('desc').getValue(),
            limitOfFruitToBeStored: FruitStorageLimit.create(100).getValue(),
        });
        expect(result.isFailure).toBe(true);
    });

    // ─── Update Description & Storage Limit ───────────────────────────────────

    it('should update description and dispatch FruitUpdatedEvent', () => {
        const fruit = Fruit.create(createValidProps()).getValue();
        fruit.clearEvents();

        const newDesc = FruitDescription.create('Updated description').getValue();
        fruit.updateDescription(newDesc);

        expect(fruit.description.value).toBe('Updated description');
        expect(fruit.domainEvents).toHaveLength(1);
        expect(fruit.domainEvents[0]).toBeInstanceOf(FruitUpdatedEvent);
    });

    it('should update storage limit and dispatch FruitUpdatedEvent', () => {
        const fruit = Fruit.create(createValidProps()).getValue();
        fruit.clearEvents();

        const newLimit = FruitStorageLimit.create(250).getValue();
        fruit.updateStorageLimit(newLimit);

        expect(fruit.limitOfFruitToBeStored.value).toBe(250);
        expect(fruit.domainEvents).toHaveLength(1);
        expect(fruit.domainEvents[0]).toBeInstanceOf(FruitUpdatedEvent);
    });

    it ('should fail when updating storage limit value below stock', () => {
        const fruit = Fruit.create(createValidProps()).getValue();
        fruit.store(50);

        const newStorageLimit = FruitStorageLimit.create(40).getValue();
        const updateStorageLimtiResult = fruit.updateStorageLimit(newStorageLimit);

        expect(updateStorageLimtiResult.isSuccess).toBe(false);
    });
    
    // ─── Store ────────────────────────────────────────────────────────────────

    it('should store fruit amount within limit and dispatch FruitUpdatedEvent', () => {
        const fruit = Fruit.create(createValidProps()).getValue();
        fruit.clearEvents();

        const storeResult = fruit.store(30);
        expect(storeResult.isSuccess).toBe(true);
        expect(fruit.stock.value).toBe(30);
        expect(fruit.domainEvents).toHaveLength(1);
        expect(fruit.domainEvents[0]).toBeInstanceOf(FruitUpdatedEvent);
    });

    it('should accumulate fruit amounts on multiple store calls', () => {
        const fruit = Fruit.create(createValidProps()).getValue();
        fruit.store(30);
        fruit.store(20);
        expect(fruit.stock.value).toBe(50);
    });

    it('should fail when storing beyond the storage limit', () => {
        const fruit = Fruit.create(createValidProps()).getValue();
        const storeResult = fruit.store(150); // limit is 100
        expect(storeResult.isFailure).toBe(true);
        expect(fruit.stock.value).toBe(0);
    });

    // ─── Remove ───────────────────────────────────────────────────────────────

    it('should remove fruit stock successfully and dispatch FruitUpdatedEvent', () => {
        const fruit = Fruit.create(createValidProps()).getValue();
        fruit.store(50);
        fruit.clearEvents();

        const removeResult = fruit.remove(20);
        expect(removeResult.isSuccess).toBe(true);
        expect(fruit.stock.value).toBe(30);
        expect(fruit.domainEvents).toHaveLength(1);
        expect(fruit.domainEvents[0]).toBeInstanceOf(FruitUpdatedEvent);
    });

    it('should fail when removing more than current stock', () => {
        const fruit = Fruit.create(createValidProps()).getValue();
        fruit.store(20);

        const removeResult = fruit.remove(25);
        expect(removeResult.isFailure).toBe(true);
        expect(removeResult.getErrorValue()).toContain('Cannot remove 25 fruits');
        expect(fruit.stock.value).toBe(20);
    });

    it('should fail when removing zero or negative amount', () => {
        const fruit = Fruit.create(createValidProps()).getValue();
        fruit.store(20);

        expect(fruit.remove(0).isFailure).toBe(true);
        expect(fruit.remove(-5).isFailure).toBe(true);
    });

    // ─── Delete ───────────────────────────────────────────────────────────────

    it('should delete successfully when stock is empty', () => {
        const fruit = Fruit.create(createValidProps()).getValue();
        fruit.clearEvents();

        const deleteResult = fruit.delete(false);
        expect(deleteResult.isSuccess).toBe(true);
        expect(fruit.domainEvents).toHaveLength(1);
        expect(fruit.domainEvents[0]).toBeInstanceOf(FruitDeletedEvent);
    });

    it('should fail deletion when stock is not empty and forceDelete is false', () => {
        const fruit = Fruit.create(createValidProps()).getValue();
        fruit.store(10);
        fruit.clearEvents();

        const deleteResult = fruit.delete(false);
        expect(deleteResult.isFailure).toBe(true);
        expect(deleteResult.getErrorValue()).toContain('stocks left in storage');
        expect(fruit.domainEvents).toHaveLength(0);
    });

    it('should allow deletion when stock is not empty if forceDelete is true', () => {
        const fruit = Fruit.create(createValidProps()).getValue();
        fruit.store(10);
        fruit.clearEvents();

        const deleteResult = fruit.delete(true);
        expect(deleteResult.isSuccess).toBe(true);
        expect(fruit.domainEvents).toHaveLength(1);
        expect(fruit.domainEvents[0]).toBeInstanceOf(FruitDeletedEvent);
    });

    
});

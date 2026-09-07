export class Identifier<T> {
    constructor(private readonly value: T) {}

    equals(id?: Identifier<T>): boolean {
        if (id === null || id === undefined) {
            return false;
        }

        if (!(id instanceof Identifier)) {
            return false;
        }

        return id.value === this.value;
    }

    toString(): string {
        return String(this.value);
    }
}
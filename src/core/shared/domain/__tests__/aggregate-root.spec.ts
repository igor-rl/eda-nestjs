import { AggregateRoot } from '../aggregate-root';
import { IDomainEvent } from '../events/domain-event.interface';
import { ValueObject } from '../value-object';
import { Uuid } from '../value-objects/uuid.vo';

class StubEvent implements IDomainEvent {
  occurred_on: Date;
  event_version: number = 1;

  constructor(
    public aggregate_id: Uuid,
    public name: string,
  ) {
    this.occurred_on = new Date();
    this.name;
  }
}

class StubAggregateRoot extends AggregateRoot {
  aggregate_id: Uuid;
  name: string;
  field1: string;

  constructor(name: string, id: Uuid) {
    super();
    this.aggregate_id = id;
    this.name = name;
    this.registerHandler(StubEvent.name, this.onStubEvent.bind(this));
  }

  get entity_id(): ValueObject {
    throw new Error('Method not implemented.');
  }

  toJSON() {
    throw new Error('Method not implemented.');
  }

  operation() {
    this.name = this.name.toUpperCase();
    this.applyEvent(new StubEvent(this.aggregate_id, this.name));
  }

  onStubEvent(event: StubEvent) {
    this.field1 = event.name;
  }
}

describe('AggregateRoot Unit Test', () => {
  test('dispach events', () => {
    const id = new Uuid();
    const aggregate = new StubAggregateRoot('test name', id);
    aggregate.operation();
    expect(aggregate.field1).toBe('TEST NAME');
  });
});

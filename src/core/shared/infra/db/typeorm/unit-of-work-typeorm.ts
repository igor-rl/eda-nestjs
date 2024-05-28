import { DataSource } from 'typeorm';
import { AggregateRoot } from '../../../domain/aggregate-root';
import { IUnitOfWork } from '../../../domain/repository/unit-of-work.interface';

export class UnitOfWorkTypeORM implements IUnitOfWork {
  private aggregateRoots: Set<AggregateRoot> = new Set<AggregateRoot>();

  constructor(private dataSource: DataSource) {}

  async start(): Promise<void> {
    return;
  }

  async commit(): Promise<void> {
    return;
  }

  async rollback(): Promise<void> {
    return;
  }

  getTransaction() {
    return;
  }

  async do<T>(workFn: (uow: IUnitOfWork) => Promise<T>): Promise<T> {
    const result = await workFn(this);
    return result;
  }

  addAggregateRoot(aggregateRoot: AggregateRoot): void {
    this.aggregateRoots.add(aggregateRoot);
  }

  getAggregateRoots(): AggregateRoot[] {
    return [...this.aggregateRoots];
  }
}

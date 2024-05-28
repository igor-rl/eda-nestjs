import { Entity } from '../entity';
import { ValueObject } from '../value-object';
import { SearchParams } from './search-params';
import { SearchResult } from './search-result';

export interface IRepository<E extends Entity, EntityId extends ValueObject> {
  insert(entity: E): Promise<void>;
  bulkInsert(entities: E[]): Promise<void>;
  update(entity: E): Promise<void>;
  delete(entity_id: EntityId | number): Promise<void>;

  findById(entity_id: EntityId | number): Promise<E | null>;
  findAll(): Promise<E[]>;
  findByIds(ids: EntityId[] | number[]): Promise<E[]>;
  existsById(ids: EntityId[] | number[]): Promise<{
    exists: EntityId[] | number[];
    not_exists: EntityId[] | number[];
  }>;

  getEntity(): new (...args: any[]) => E;
}

export interface ISearchableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult,
> extends IRepository<E, EntityId> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}

import type { Option } from '../functional/option';

export interface RepositoryPort<T> {
  save(entity: T): Promise<void>;
  findById(id: string): Promise<Option<T>>;
  delete(entity: T): Promise<void>;
}

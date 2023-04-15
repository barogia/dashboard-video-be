import { Request } from 'express';
import { User } from 'src/modules/user/entity/user.entity';
import {} from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
interface RequestWithUser extends Request {
  user: User;
}

interface IBaseService<T> {
  findMany(): Promise<T[]>;
  findById(id: EntityId): Promise<T>;
  findByIds(ids: EntityId[]): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: EntityId, data: any): Promise<T>;
  delete(id: EntityId): Promise<T>;
}

import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class BaseRepository<T extends BaseEntity> {
    constructor(protected readonly repository: Repository<T>) { }

    async findById(id: number): Promise<T | null> {
        return this.repository.findOne({
            where: { id } as FindOptionsWhere<T>,
        });
    }

    async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.find(options);
    }

    async create(entity: Partial<T>): Promise<T> {
        const newEntity = this.repository.create(entity as any);
        return this.repository.save(newEntity as any);
    }

    async update(id: number, entity: Partial<T>): Promise<T | null> {
        await this.repository.update(id, entity as any);
        return this.findById(id);
    }

    async softDelete(id: number): Promise<boolean> {
        const result = await this.repository.softDelete(id);
        return (result.affected ?? 0) > 0;
    }

    async hardDelete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }

    async count(where?: FindOptionsWhere<T>): Promise<number> {
        return this.repository.count({ where });
    }

    async findWithPagination(
        page: number = 1,
        limit: number = 10,
        options?: FindManyOptions<T>,
    ): Promise<{ data: T[]; total: number }> {
        const [data, total] = await this.repository.findAndCount({
            ...options,
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }
}

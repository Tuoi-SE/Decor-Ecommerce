/**
 * Base Entity with Audit Fields and Soft Delete
 * All entities should extend this class
 */

import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Column,
} from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'is_deleted', default: false })
    isDeleted: boolean;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @Column({
        type: 'json',
        nullable: true,
        name: 'created_by',
    })
    createdBy: {
        id: number;
        email: string;
    };

    @Column({
        type: 'json',
        nullable: true,
        name: 'updated_by',
    })
    updatedBy: {
        id: number;
        email: string;
    };

    @Column({
        type: 'json',
        nullable: true,
        name: 'deleted_by',
    })
    deletedBy: {
        id: number;
        email: string;
    };
}

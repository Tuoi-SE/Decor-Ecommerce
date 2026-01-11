import { Entity, Column, ManyToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { User } from '@/modules/user/domain/entities/user.entity';

@Entity('roles')
export class Role extends BaseEntity {
    @Column({ unique: true })
    @IsNotEmpty()
    @IsString()
    name: string;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    description: string;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}

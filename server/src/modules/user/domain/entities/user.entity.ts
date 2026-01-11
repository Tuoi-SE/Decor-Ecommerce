import {
    Entity,
    Column,
    ManyToMany,
    JoinTable,
    OneToMany,
} from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsPhoneNumber, IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@/shared/base';
import { Role } from '@/modules/user/domain/entities/role.entity';
import { Address } from '@/modules/user/domain/entities/address.entity';
import { Notification } from '@/modules/user/domain/entities/notification.entity';

@Entity('users')
export class User extends BaseEntity {
    @Column({ unique: true })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column({ name: 'password_hash', select: false })
    @Exclude()
    passwordHash: string;

    // Virtual field for password (used in registration, not stored)
    password?: string;

    @Column({ name: 'first_name' })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @Column({ name: 'last_name' })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @Column({ name: 'full_name' })
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @Column({ nullable: true })
    @IsOptional()
    @IsPhoneNumber('VN')
    phone: string;

    @Column({ name: 'avatar_url', nullable: true })
    @IsOptional()
    @IsString()
    avatarUrl: string;

    @Column({ name: 'refresh_token', nullable: true })
    @IsOptional()
    @IsString()
    refreshToken: string;

    @Column({ default: 'active' })
    @IsEnum(['active', 'inactive', 'banned'])
    status: string;

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({
        name: 'user_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Role[];

    @OneToMany(() => Address, (address) => address.user)
    addresses: Address[];

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];
}

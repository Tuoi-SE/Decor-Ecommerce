import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsPhoneNumber, IsOptional } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { User } from '@/modules/user/domain/entities/user.entity';

@Entity('addresses')
export class Address extends BaseEntity {
    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'receiver_name' })
    @IsNotEmpty()
    @IsString()
    receiverName: string;

    @Column({ name: 'receiver_phone' })
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    receiverPhone: string;

    @Column()
    @IsNotEmpty()
    street: string;

    @Column()
    @IsNotEmpty()
    ward: string;

    @Column()
    @IsNotEmpty()
    district: string;

    @Column()
    @IsNotEmpty()
    city: string;

    @Column({ name: 'is_default', default: false })
    @IsOptional()
    isDefault: boolean;

    @ManyToOne(() => User, (user) => user.addresses)
    @JoinColumn({ name: 'user_id' })
    user: User;
}

import { Entity, Column } from 'typeorm';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { BaseEntity } from '@/shared/base';

@Entity('vouchers')
export class Voucher extends BaseEntity {
    @Column({ unique: true })
    @IsNotEmpty()
    @IsString()
    code: string;

    @Column({ name: 'discount_type' })
    @IsEnum(['percentage', 'fixed_amount'])
    discountType: string;

    @Column('decimal', { name: 'discount_value', precision: 10, scale: 2 })
    @IsNotEmpty()
    discountValue: number;

    @Column('decimal', { name: 'min_order_amount', precision: 10, scale: 2, default: 0 })
    @IsOptional()
    minOrderAmount: number;

    @Column({ name: 'usage_limit', default: 0 })
    @IsOptional()
    usageLimit: number;

    @Column({ name: 'expired_at', type: 'datetime' })
    @IsNotEmpty()
    expiredAt: Date;
}

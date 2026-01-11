import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { Order } from '@/modules/order/domain/entities/order.entity';

@Entity('payments')
export class Payment extends BaseEntity {
    @Column({ name: 'order_id' })
    orderId: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    provider: string;

    @Column({ name: 'transaction_code' })
    @IsNotEmpty()
    @IsString()
    transactionCode: string;

    @Column('decimal', { precision: 10, scale: 2 })
    @IsNotEmpty()
    amount: number;

    @Column()
    @IsEnum(['pending', 'success', 'failed'])
    status: string;

    @Column({ name: 'paid_at', type: 'datetime' })
    @IsNotEmpty()
    paidAt: Date;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order: Order;
}

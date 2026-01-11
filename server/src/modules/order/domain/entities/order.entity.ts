import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional, IsEnum, Min } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { User } from '@/modules/user/domain/entities/user.entity';
import { Address } from '@/modules/user/domain/entities/address.entity';
import { Voucher } from '@/modules/payment/domain/entities/voucher.entity';
import { Product } from '@/modules/product/domain/entities/product.entity';

@Entity('orders')
export class Order extends BaseEntity {
    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'address_id' })
    addressId: number;

    @Column({ name: 'voucher_id', nullable: true })
    @IsOptional()
    voucherId: number;

    @Column({ name: 'order_code', unique: true })
    @IsNotEmpty()
    @IsString()
    orderCode: string;

    @Column('decimal', { name: 'total_amount', precision: 10, scale: 2 })
    @IsNotEmpty()
    totalAmount: number;

    @Column({ name: 'payment_status', default: 'pending' })
    @IsEnum(['pending', 'paid', 'refunded'])
    paymentStatus: string;

    @Column({ name: 'order_status', default: 'pending' })
    @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'])
    orderStatus: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Address)
    @JoinColumn({ name: 'address_id' })
    address: Address;

    @ManyToOne(() => Voucher)
    @JoinColumn({ name: 'voucher_id' })
    voucher: Voucher;

    @OneToMany(() => OrderItem, (item) => item.order)
    items: OrderItem[];
}

@Entity('order_items')
export class OrderItem extends BaseEntity {
    @Column({ name: 'order_id' })
    orderId: number;

    @Column({ name: 'product_id', nullable: true })
    @IsOptional()
    productId: number;

    @Column({ name: 'combo_id', nullable: true })
    @IsOptional()
    comboId: number;

    @Column()
    @IsNotEmpty()
    @Min(1)
    quantity: number;

    @Column('decimal', { name: 'unit_price', precision: 10, scale: 2 })
    @IsNotEmpty()
    unitPrice: number;

    @ManyToOne(() => Order, (order) => order.items)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}

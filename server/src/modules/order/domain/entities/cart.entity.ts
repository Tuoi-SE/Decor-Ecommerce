import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional, IsEnum, Min } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { User } from '@/modules/user/domain/entities/user.entity';
import { Product } from '@/modules/product/domain/entities/product.entity';

@Entity('carts')
export class Cart extends BaseEntity {
    @Column({ name: 'user_id', nullable: true })
    @IsOptional()
    userId: number;

    @Column({ name: 'session_id', nullable: true })
    @IsOptional()
    @IsString()
    sessionId: string;

    @Column({ default: 'active' })
    @IsEnum(['active', 'merged', 'abandoned'])
    status: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => CartItem, (item) => item.cart)
    items: CartItem[];
}

@Entity('cart_items')
export class CartItem extends BaseEntity {
    @Column({ name: 'cart_id' })
    cartId: number;

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
    @Min(0)
    unitPrice: number;

    @ManyToOne(() => Cart, (cart) => cart.items)
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}

import { Entity, Column, OneToMany, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '@/shared/base';
import { User } from '@/modules/user/domain/entities/user.entity';
import { Product } from '@/modules/product/domain/entities/product.entity';

@Entity('wishlists')
export class Wishlist extends BaseEntity {
    @Column({ name: 'user_id', unique: true })
    userId: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => WishlistItem, (item) => item.wishlist)
    items: WishlistItem[];
}

@Entity('wishlist_items')
export class WishlistItem extends BaseEntity {
    @Column({ name: 'wishlist_id' })
    wishlistId: number;

    @Column({ name: 'product_id' })
    productId: number;

    @ManyToOne(() => Wishlist, (wishlist) => wishlist.items)
    @JoinColumn({ name: 'wishlist_id' })
    wishlist: Wishlist;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}

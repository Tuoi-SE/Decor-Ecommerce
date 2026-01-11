import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem, Cart, CartItem, Wishlist, WishlistItem } from './domain/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Order,
            OrderItem,
            Cart,
            CartItem,
            Wishlist,
            WishlistItem,
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [TypeOrmModule],
})
export class OrderModule { }

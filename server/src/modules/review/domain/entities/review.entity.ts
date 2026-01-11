import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional, Min, Max } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { User } from '@/modules/user/domain/entities/user.entity';
import { Product } from '@/modules/product/domain/entities/product.entity';
import { SetupBooking } from '@/modules/setup-service/domain/entities/setup-service.entity';

@Entity('product_reviews')
export class ProductReview extends BaseEntity {
    @Column({ name: 'product_id' })
    productId: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    rating: number;

    @Column('text')
    @IsNotEmpty()
    @IsString()
    comment: string;

    @Column('text', { nullable: true })
    @IsOptional()
    @IsString()
    images: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}

@Entity('setup_service_reviews')
export class SetupServiceReview extends BaseEntity {
    @Column({ name: 'setup_booking_id' })
    setupBookingId: number;

    @Column({ name: 'user_id' })
    userId: number;

    @Column()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    rating: number;

    @Column('text')
    @IsNotEmpty()
    @IsString()
    comment: string;

    @ManyToOne(() => SetupBooking)
    @JoinColumn({ name: 'setup_booking_id' })
    setupBooking: SetupBooking;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}

import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { User } from '@/modules/user/domain/entities/user.entity';

@Entity('setup_services')
export class SetupService extends BaseEntity {
    @Column()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Column('text')
    @IsNotEmpty()
    @IsString()
    description: string;

    @Column('decimal', { name: 'base_price', precision: 10, scale: 2 })
    @IsNotEmpty()
    basePrice: number;

    @Column({ name: 'pricing_type', default: 'package' })
    @IsEnum(['package', 'hourly', 'fixed'])
    pricingType: string;

    @Column({ name: 'duration_hours', nullable: true })
    @IsOptional()
    durationHours: number;
}

@Entity('setup_bookings')
export class SetupBooking extends BaseEntity {
    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'setup_service_id' })
    setupServiceId: number;

    @Column({ name: 'order_id', nullable: true })
    @IsOptional()
    orderId: number;

    @Column({ name: 'booking_date', type: 'datetime' })
    @IsNotEmpty()
    bookingDate: Date;

    @Column({ default: 'pending' })
    @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
    status: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => SetupService)
    @JoinColumn({ name: 'setup_service_id' })
    setupService: SetupService;
}

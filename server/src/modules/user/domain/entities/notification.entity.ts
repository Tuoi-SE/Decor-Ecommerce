import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { User } from '@/modules/user/domain/entities/user.entity';

@Entity('notifications')
export class Notification extends BaseEntity {
    @Column({ name: 'user_id' })
    userId: number;

    @Column()
    @IsNotEmpty()
    type: string;

    @Column()
    @IsNotEmpty()
    title: string;

    @Column('text')
    @IsNotEmpty()
    content: string;

    @Column({ name: 'is_read', default: false })
    @IsOptional()
    isRead: boolean;

    @ManyToOne(() => User, (user) => user.notifications)
    @JoinColumn({ name: 'user_id' })
    user: User;
}

import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { BaseEntity } from '@/shared/base';
import { User } from '@/modules/user/domain/entities/user.entity';

@Entity('support_tickets')
export class SupportTicket extends BaseEntity {
    @Column({ name: 'user_id' })
    userId: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    subject: string;

    @Column('text')
    @IsNotEmpty()
    @IsString()
    message: string;

    @Column({ default: 'open' })
    @IsEnum(['open', 'closed', 'pending'])
    status: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => SupportMessage, (message) => message.ticket)
    messages: SupportMessage[];
}

@Entity('support_messages')
export class SupportMessage extends BaseEntity {
    @Column({ name: 'ticket_id' })
    ticketId: number;

    @Column({ name: 'sender_type' })
    @IsEnum(['user', 'admin', 'support'])
    senderType: string;

    @Column({ name: 'sender_id', nullable: true })
    @IsOptional()
    senderId: number;

    @Column('text')
    @IsNotEmpty()
    @IsString()
    message: string;

    @ManyToOne(() => SupportTicket, (ticket) => ticket.messages)
    @JoinColumn({ name: 'ticket_id' })
    ticket: SupportTicket;
}

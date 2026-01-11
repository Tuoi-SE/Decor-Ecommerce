import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicket, SupportMessage } from './domain/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([SupportTicket, SupportMessage]),
    ],
    controllers: [],
    providers: [],
    exports: [TypeOrmModule],
})
export class SupportModule { }

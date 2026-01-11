import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupService, SetupBooking } from './domain/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([SetupService, SetupBooking]),
    ],
    controllers: [],
    providers: [],
    exports: [TypeOrmModule],
})
export class SetupServiceModule { }

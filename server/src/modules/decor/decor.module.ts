import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DecorRoom, Combo } from './domain/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([DecorRoom, Combo]),
    ],
    controllers: [],
    providers: [],
    exports: [TypeOrmModule],
})
export class DecorModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner, ContentPage } from './domain/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([Banner, ContentPage]),
    ],
    controllers: [],
    providers: [],
    exports: [TypeOrmModule],
})
export class ContentModule { }

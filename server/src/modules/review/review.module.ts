import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReview, SetupServiceReview } from './domain/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductReview, SetupServiceReview]),
    ],
    controllers: [],
    providers: [],
    exports: [TypeOrmModule],
})
export class ReviewModule { }

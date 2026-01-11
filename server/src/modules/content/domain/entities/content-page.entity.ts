import { Entity, Column } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { BaseEntity } from '@/shared/base';

@Entity('content_pages')
export class ContentPage extends BaseEntity {
    @Column({ unique: true })
    @IsNotEmpty()
    @IsString()
    slug: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    title: string;

    @Column('text', { name: 'content_html', nullable: true })
    @IsOptional()
    @IsString()
    contentHtml: string;

    @Column({ name: 'is_active', default: true })
    @IsOptional()
    isActive: boolean;
}

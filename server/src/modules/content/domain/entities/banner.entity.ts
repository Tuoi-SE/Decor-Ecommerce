import { Entity, Column } from 'typeorm';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { BaseEntity } from '@/shared/base';

@Entity('banners')
export class Banner extends BaseEntity {
    @Column()
    @IsNotEmpty()
    @IsString()
    title: string;

    @Column({ name: 'image_url' })
    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @Column({ name: 'link_url', nullable: true })
    @IsOptional()
    @IsString()
    linkUrl: string;

    @Column({ default: 'home_slider' })
    @IsEnum(['home_slider', 'sidebar', 'footer'])
    position: string;

    @Column({ name: 'is_active', default: true })
    @IsOptional()
    isActive: boolean;

    @Column({ name: 'start_at', type: 'datetime', nullable: true })
    @IsOptional()
    startAt: Date;

    @Column({ name: 'end_at', type: 'datetime', nullable: true })
    @IsOptional()
    endAt: Date;
}

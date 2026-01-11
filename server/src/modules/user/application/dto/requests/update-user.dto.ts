import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
    @ApiPropertyOptional({ example: 'https://res.cloudinary.com/.../avatar.jpg', description: 'Avatar URL' })
    @IsOptional()
    @IsString()
    avatarUrl?: string;
}

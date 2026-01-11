import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import aqp from 'api-query-params';
import { User } from '../../domain/entities';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto';
import { PaginationDto, PaginatedResponse } from '@/shared/dto';

import { UploadService } from '@/modules/upload/application/services/upload.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly uploadService: UploadService,
    ) { }

    async create(createUserDto: CreateUserDto, user: any): Promise<{ id: number; createdAt: Date }> {
        // ... (validation checks same as before)
        // Check if user already exists by email
        const existingUserByEmail = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });

        if (existingUserByEmail) {
            throw new ConflictException('User with this email already exists');
        }

        // Check if phone number already exists
        if (createUserDto.phoneNumber) {
            const existingUserByPhone = await this.userRepository.findOne({
                where: { phone: createUserDto.phoneNumber },
            });

            if (existingUserByPhone) {
                throw new ConflictException('User with this phone number already exists');
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        // Create user
        const newUser = this.userRepository.create({
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            fullName: `${createUserDto.firstName} ${createUserDto.lastName}`,
            email: createUserDto.email,
            phone: createUserDto.phoneNumber,
            passwordHash: hashedPassword,
            createdBy: {
                id: user.id,
                email: user.email,
            },
        });

        const savedUser = await this.userRepository.save(newUser);

        return {
            id: savedUser.id,
            createdAt: savedUser.createdAt,
        };
    }

    // ... findAll and findOne remain same ...
    async findAll(currentPage: string, limit: string, qs: string): Promise<PaginatedResponse<UserResponseDto>> {
        const { filter, sort, population } = aqp(qs);
        delete filter.current;
        delete filter.pageSize;

        const offset = (+currentPage - 1) * (+limit);
        const defaultLimit = +limit ? +limit : 10;

        const totalItems = (await this.userRepository.find({ where: filter, withDeleted: true })).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const result = await this.userRepository.find({
            where: filter,
            take: defaultLimit,
            skip: offset,
            order: sort as any,
            withDeleted: true,
        });

        const data = result.map((user) => this.toResponseDto(user));

        return new PaginatedResponse(data, totalItems, +currentPage || 1, defaultLimit);
    }

    async findOne(id: number): Promise<UserResponseDto> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['roles'],
            withDeleted: true,
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return this.toResponseDto(user);
    }

    async update(id: number, updateUserDto: UpdateUserDto, user: any): Promise<any> {
        const foundUser = await this.userRepository.findOne({ where: { id } });

        if (!foundUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // ... validation checks ...
        if (updateUserDto.email && updateUserDto.email !== foundUser.email) {
            const existingUserByEmail = await this.userRepository.findOne({
                where: { email: updateUserDto.email },
            });

            if (existingUserByEmail) {
                throw new ConflictException('Email already in use');
            }
        }

        if (updateUserDto.phoneNumber && updateUserDto.phoneNumber !== foundUser.phone) {
            const existingUserByPhone = await this.userRepository.findOne({
                where: { phone: updateUserDto.phoneNumber },
            });

            if (existingUserByPhone) {
                throw new ConflictException('Phone number already in use');
            }
        }

        if (updateUserDto.password) {
            foundUser.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
        }

        if (updateUserDto.firstName) foundUser.firstName = updateUserDto.firstName;
        if (updateUserDto.lastName) foundUser.lastName = updateUserDto.lastName;
        if (updateUserDto.firstName || updateUserDto.lastName) {
            foundUser.fullName = `${foundUser.firstName} ${foundUser.lastName}`;
        }
        if (updateUserDto.email) foundUser.email = updateUserDto.email;
        if (updateUserDto.phoneNumber) foundUser.phone = updateUserDto.phoneNumber;
        if (updateUserDto.avatarUrl && updateUserDto.avatarUrl !== foundUser.avatarUrl) {
            // Delete old avatar if exists and is a Cloudinary url
            if (foundUser.avatarUrl) {
                const publicId = this.uploadService.extractPublicIdFromUrl(foundUser.avatarUrl);
                if (publicId) {
                    await this.uploadService.deleteImage(publicId);
                }
            }
            foundUser.avatarUrl = updateUserDto.avatarUrl;
        }

        // Audit fields
        foundUser.updatedBy = {
            id: user.id,
            email: user.email,
        };

        await this.userRepository.save(foundUser);

        return {
            acknowledged: true,
            modifiedCount: 1,
            upsertedId: null,
            upsertedCount: 0,
            matchedCount: 1,
        };
    }

    async remove(id: number, user: any): Promise<{ deleted: number }> {
        const foundUser = await this.userRepository.findOne({ where: { id } });

        if (!foundUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Set deleted by info and isDeleted flag
        foundUser.deletedBy = {
            id: user.id,
            email: user.email,
        };
        foundUser.isDeleted = true;

        // Save the updates first (deletedBy, isDeleted)
        await this.userRepository.save(foundUser);

        // Then soft delete (sets deletedAt)
        await this.userRepository.softDelete(id);

        return { deleted: 1 };
    }

    private toResponseDto(user: User): UserResponseDto {
        return new UserResponseDto({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            status: user.status,
            isDeleted: user.isDeleted,
            createdBy: user.createdBy,
            updatedBy: user.updatedBy,
            deletedBy: user.deletedBy,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        });
    }
}

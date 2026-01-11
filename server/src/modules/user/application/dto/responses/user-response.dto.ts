import { Expose } from 'class-transformer';

export class UserResponseDto {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    status: string;

    @Expose()
    isDeleted: boolean;

    @Expose()
    createdBy: {
        id: number;
        email: string;
    };

    @Expose()
    updatedBy: {
        id: number;
        email: string;
    };

    @Expose()
    deletedBy: {
        id: number;
        email: string;
    };

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    deletedAt: Date;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}

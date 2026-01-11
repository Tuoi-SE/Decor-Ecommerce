import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Role, Address, Notification } from './domain/entities';
import { UserService } from './application/services/user.service';
import { UserController } from './presentation/controllers/user.controller';

import { UploadModule } from '@/modules/upload/upload.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role, Address, Notification]),
        UploadModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [TypeOrmModule, UserService],
})
export class UserModule { }

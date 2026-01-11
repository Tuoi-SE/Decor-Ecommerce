import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto, UpdateUserDto } from '../../application/dto';
import { PaginationDto } from '@/shared/dto';
import { ResponseMessage } from '@/shared/decorators';
import { Roles, CurrentUser } from '@/shared/decorators';
import { UserRole } from '@/shared/enums';

import type { IUser } from '@/shared/interfaces';

@Controller({ path: 'users', version: '1' })
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ResponseMessage('User created successfully')
    create(
        @Body() createUserDto: CreateUserDto,
        @CurrentUser() user: IUser,
    ) {
        return this.userService.create(createUserDto, user);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.STAFF)
    @ResponseMessage('Users retrieved successfully')
    findAll(
        @Query("current") currentPage: string,
        @Query("pageSize") limit: string,
        @Query() qs: string,
    ) {
        return this.userService.findAll(currentPage, limit, qs);
    }

    @Get(':id')
    @ResponseMessage('User retrieved successfully')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @ResponseMessage('User updated successfully')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
        @CurrentUser() user: IUser,
    ) {
        return this.userService.update(id, updateUserDto, user);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ResponseMessage('User deleted successfully')
    remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: IUser,
    ) {
        return this.userService.remove(id, user);
    }
}

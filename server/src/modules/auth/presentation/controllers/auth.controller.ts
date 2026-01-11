import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Controller, Post, Body, HttpCode, HttpStatus, Res, Req, BadRequestException } from '@nestjs/common';
import { Public, ResponseMessage, CurrentUser } from '@/shared/decorators';
import type { Response, Request } from 'express';
import type { IUser } from '@/shared/interfaces';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto, RegisterDto } from '../../application/dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    @ResponseMessage('User registered successfully')
    async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) response: Response) {
        return this.authService.register(registerDto, response);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ResponseMessage('Login successful')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(loginDto, response);
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({ status: 201, description: 'Logout successful' })
    @ResponseMessage('Logout successful')
    async logout(@CurrentUser() user: IUser, @Res({ passthrough: true }) response: Response) {
        return this.authService.logout(user.id, response);
    }

    @Public()
    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 201, description: 'Token refresh successful' })
    @ApiResponse({ status: 400, description: 'Refresh token not found or invalid' })
    @ResponseMessage('Token refresh successful')
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies['refresh_token'];
        if (!refreshToken) {
            throw new BadRequestException('Refresh token not found');
        }

        return this.authService.processNewToken(refreshToken, response);
    }
}

import { Response } from 'express';
import ms from 'ms';
import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User } from '@/modules/user/domain/entities';
import { LoginDto, RegisterDto } from '../dto';
import { JwtPayload } from '../strategies/jwt.strategy';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRE') || '7d') as any,
        });
        return refresh_token;
    }

    async register(registerDto: RegisterDto, response: Response) {
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const newUser = this.userRepository.create({
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            fullName: `${registerDto.firstName} ${registerDto.lastName}`,
            email: registerDto.email,
            phone: registerDto.phoneNumber,
            passwordHash: hashedPassword,
        });

        const savedUser = await this.userRepository.save(newUser);

        return this.generateTokensAndSetCookie(savedUser, response);
    }

    async login(loginDto: LoginDto, response: Response) {
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email },
            relations: ['roles'],
            select: ['id', 'email', 'firstName', 'lastName', 'passwordHash', 'fullName'],
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateTokensAndSetCookie(user, response);
    }

    async logout(userId: number, response: Response) {
        await this.userRepository.update(userId, { refreshToken: null as any });
        response.clearCookie('refresh_token');
        return { message: 'Logged out successfully' };
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            });

            const user = await this.userRepository.findOne({
                where: { refreshToken }, // Find user by token primarily or extract ID first? Better to follow simple safety as before or user example style? 
                // User example: findUserByToken. Let's extract ID from verified payload for safety + double check token matches.
                relations: ['roles'],
            });

            // If verify passes, payload is valid. But we need to find WHICH user. 
            // The verified payload has 'sub'. 
            // Let's decode or trust verifying.
            // Wait, I should reconstruct payload exactly as before.

            if (!user) {
                // If finding by token fails (maybe expired in DB or replaced), try decoding sub? 
                // Actually user example uses findUserByToken. 
                // My previous implementation verified then found by ID. 
                // Let's use payload.sub from verify to find user, then check token match.
                throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login.");
            }
            // Wait, user example code: findUserByToken(refreshToken). 
            // Currently I don't have findByToken on repo easily unless I query it. 
            // Let's adapt to my repo structure: verify -> get ID -> find User -> check token match.

            // Re-verify to get payload since I need ID
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            });

            const foundUser = await this.userRepository.findOne({ where: { id: payload.sub }, relations: ['roles'] });

            if (foundUser && foundUser.refreshToken === refreshToken) {
                return this.generateTokensAndSetCookie(foundUser, response);
            } else {
                throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login.");
            }
        } catch (error) {
            throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login.");
        }
    }

    // Helper to unify logic
    private async generateTokensAndSetCookie(user: User, response: Response) {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            roles: user.roles?.map((role) => role.name) || [],
        };

        const refresh_token = this.createRefreshToken(payload);

        // API User Example: updateUserToken
        await this.userRepository.update(user.id, { refreshToken: refresh_token });

        // API User Example: clear then set cookie
        response.clearCookie('refresh_token');
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as ms.StringValue)
        });

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRE') || '15m') as any,
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        });

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: user.fullName,
                roles: user.roles?.map((r) => r.name) || [],
            },
        };
    }

    // Removed old methods to prevent duplicates
}

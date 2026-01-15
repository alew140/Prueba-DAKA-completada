import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request, UnauthorizedException, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() signInDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
        const user = await this.authService.validateUser(signInDto.username, signInDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const { access_token, user: userData } = await this.authService.login(user);

        response.cookie('accessToken', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        return { user: userData };
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('accessToken');
        return { message: 'Logged out successfully' };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        this.logger.warn(`Failed login attempt for user: ${username}`);
        return null;
    }

    async login(user: any) {
        this.logger.log(`Login attempt for user: ${user.username}`);
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username
            }
        };
        this.logger.log(`Successful login for user: ${user.username}`);
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username
            }
        };
    }

    async register(createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        // Automatically login after register or just return user?
        // Requirement says "Return success message" but usually we return token or user.
        // Let's return the user without password.
        const { password, ...result } = user;
        return result;
    }
}

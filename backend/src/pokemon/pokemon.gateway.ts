import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PokemonService } from './pokemon.service';
import { JwtService } from '@nestjs/jwt';
import { Logger, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    },
})
export class PokemonGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(PokemonGateway.name);

    constructor(
        private readonly pokemonService: PokemonService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            // Extract token from cookie
            const cookieString = client.handshake.headers.cookie;
            const token = cookieString?.match(/accessToken=([^;]+)/)?.[1] || client.handshake.auth.token || client.handshake.query.token;

            if (!token) {
                throw new UnauthorizedException('No token provided');
            }
            const payload = this.jwtService.verify(token as string, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });
            client.data.user = payload;
            this.logger.log(`Client connected: ${client.id} (User: ${payload.username})`);
        } catch (error) {
            this.logger.warn(`Connection rejected: ${error.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('request-sprite')
    async handleRequestSprite(
        @ConnectedSocket() client: Socket,
    ) {
        if (!client.data.user) {
            throw new UnauthorizedException('Not authenticated');
        }
        this.logger.log(`Sprite requested by ${client.data.user.username}`);

        try {
            const pokemon = await this.pokemonService.getRandomSprite();
            client.emit('new-sprite', pokemon);
        } catch (error) {
            client.emit('error', { message: 'Failed to fetch pokemon' });
        }
    }

    @SubscribeMessage('delete-sprite')
    handleDeleteSprite(@MessageBody() data: { id: number }) {
        // Just acknowledging or logging, as state is client-side for this simple app
        this.logger.log(`Sprite deleted: ${data.id}`);
    }
}

import { Injectable, Logger, BadGatewayException, NotFoundException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PokemonService {
    private readonly logger = new Logger(PokemonService.name);
    private readonly POKEAPI_BASE = 'https://pokeapi.co/api/v2';

    async getPokemon(id: number) {
        try {
            const response = await axios.get(`${this.POKEAPI_BASE}/pokemon/${id}`);
            if (!response.data?.sprites?.front_default) {
                throw new Error('Invalid response from PokeAPI');
            }
            return {
                id: response.data.id,
                name: response.data.name,
                sprites: {
                    front_default: response.data.sprites.front_default
                }
            };
        } catch (error) {
            this.logger.error(`Error fetching pokemon ${id}`, error);
            throw new BadGatewayException('Unable to fetch pokemon from external API');
        }
    }

    async getRandomSprite() {
        const id = Math.floor(Math.random() * 898) + 1;
        return this.getPokemon(id);
    }
}

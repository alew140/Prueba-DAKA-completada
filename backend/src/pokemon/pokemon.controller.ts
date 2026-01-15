import { Controller, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pokemon')
@UseGuards(JwtAuthGuard)
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) { }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.pokemonService.getPokemon(id);
    }
}

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoDto } from './diagnostico.dto/diagnostico.dto';  // Importamos el DTO
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('diagnostico')
@UseInterceptors(BusinessErrorsInterceptor)
export class DiagnosticoController {
    constructor(private readonly diagnosticoService: DiagnosticoService) { }

    @Get()
    async findAll() {
        return await this.diagnosticoService.findAll();
    }

    @Get(':diagnosticoId')
    async findOne(@Param('diagnosticoId') diagnosticoId: string) {
        return await this.diagnosticoService.findOne(diagnosticoId);
    }

    @Post()
    async create(@Body() diagnosticoDto: DiagnosticoDto) {
        const diagnostico: DiagnosticoEntity = plainToInstance(DiagnosticoEntity, diagnosticoDto);
        return await this.diagnosticoService.create(diagnostico);
    }

    @Put(':diagnosticoId')
    async update(@Param('diagnosticoId') diagnosticoId: string, @Body() diagnosticoDto: DiagnosticoDto) {
        const diagnostico: DiagnosticoEntity = plainToInstance(DiagnosticoEntity, diagnosticoDto);
        return await this.diagnosticoService.update(diagnosticoId, diagnostico);
    }

    @Delete(':diagnosticoId')
    @HttpCode(204)
    async delete(@Param('diagnosticoId') diagnosticoId: string) {
        return await this.diagnosticoService.delete(diagnosticoId);
    }
}

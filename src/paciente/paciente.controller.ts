import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PacienteService } from './paciente.service';
import { PacienteDto } from './paciente.dto/paciente.dto';  // Importamos el DTO
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('paciente')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteController {
    constructor(private readonly pacienteService: PacienteService) { }

    @Get()
    async findAll() {
        return await this.pacienteService.findAll();
    }

    @Get(':pacienteId')
    async findOne(@Param('pacienteId') pacienteId: string) {
        return await this.pacienteService.findOne(pacienteId);
    }

    @Post()
    async create(@Body() pacienteDto: PacienteDto) {
        const paciente: PacienteEntity = plainToInstance(PacienteEntity, pacienteDto);
        return await this.pacienteService.create(paciente);
    }

    @Put(':pacienteId')
    async update(@Param('pacienteId') pacienteId: string, @Body() pacienteDto: PacienteDto) {
        const paciente: PacienteEntity = plainToInstance(PacienteEntity, pacienteDto);
        return await this.pacienteService.update(pacienteId, paciente);
    }

    @Delete(':pacienteId')
    @HttpCode(204)
    async delete(@Param('pacienteId') pacienteId: string) {
        return await this.pacienteService.delete(pacienteId);
    }
}

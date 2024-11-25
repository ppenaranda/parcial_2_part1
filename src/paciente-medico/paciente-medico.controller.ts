import { Body, Controller, Delete, Get, HttpCode, Param, Post, UseInterceptors } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('paciente')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteMedicoController {
    constructor(private readonly pacienteMedicoService: PacienteMedicoService) { }

    // Método para agregar un médico a un paciente
    @Post(':pacienteId/medico/:medicoId')
    async addMedicoToPaciente(
        @Param('pacienteId') pacienteId: string,
        @Param('medicoId') medicoId: string
    ) {
        return await this.pacienteMedicoService.addMedicoToPaciente(pacienteId, medicoId);
    }

    @Get(':pacienteId/medicos')
    async findMedicosByPacienteId(@Param('pacienteId') pacienteId: string) {
        return await this.pacienteMedicoService.findMedicosByPacienteId(pacienteId);
    }

    @Delete(':pacienteId/medico/:medicoId')
    @HttpCode(204)
    async deleteMedicoFromPaciente(
        @Param('pacienteId') pacienteId: string,
        @Param('medicoId') medicoId: string
    ) {
        return await this.pacienteMedicoService.deleteMedicoFromPaciente(pacienteId, medicoId);
    }
}

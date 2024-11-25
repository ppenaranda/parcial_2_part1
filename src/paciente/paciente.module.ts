import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity/diagnostico.entity';
import { PacienteMedicoService } from '../paciente-medico/paciente-medico.service';
import { PacienteController } from './paciente.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PacienteEntity, DiagnosticoEntity, MedicoEntity]), // Registrar repositorios
  ],
  providers: [PacienteService, PacienteMedicoService], // Incluye los servicios necesarios
  exports: [PacienteService], controllers: [PacienteController],
})
export class PacienteModule {}

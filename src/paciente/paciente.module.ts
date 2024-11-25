import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { MedicoEntity } from 'src/medico/medico.entity/medico.entity';
import { DiagnosticoEntity } from 'src/diagnostico/diagnostico.entity/diagnostico.entity';
import { PacienteMedicoService } from 'src/paciente-medico/paciente-medico.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PacienteEntity, DiagnosticoEntity, MedicoEntity]), // Registrar repositorios
  ],
  providers: [PacienteService, PacienteMedicoService], // Incluye los servicios necesarios
  exports: [PacienteService],
})
export class PacienteModule {}

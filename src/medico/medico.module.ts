import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity/medico.entity';
import { PacienteEntity } from 'src/paciente/paciente.entity/paciente.entity'; // Importamos PacienteEntity
import { PacienteModule } from 'src/paciente/paciente.module'; // Importamos PacienteModule

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicoEntity, PacienteEntity]), // Registramos MedicoEntity y PacienteEntity
    PacienteModule, // Importamos PacienteModule para acceso al servicio y repositorio
  ],
  providers: [MedicoService],
  exports: [MedicoService],
})
export class MedicoModule {}

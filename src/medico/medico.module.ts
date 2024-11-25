import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity'; // Importamos PacienteEntity
import { PacienteModule } from '../paciente/paciente.module'; // Importamos PacienteModule
import { MedicoController } from './medico.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicoEntity, PacienteEntity]), // Registramos MedicoEntity y PacienteEntity
    PacienteModule, // Importamos PacienteModule para acceso al servicio y repositorio
  ],
  providers: [MedicoService],
  exports: [MedicoService],
  controllers: [MedicoController],
})
export class MedicoModule {}

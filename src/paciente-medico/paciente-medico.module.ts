import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { PacienteMedicoController } from './paciente-medico.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PacienteEntity, MedicoEntity])
  ],
  providers: [PacienteMedicoService],
  exports: [PacienteMedicoService],
  controllers: [PacienteMedicoController],
})
export class PacienteMedicoModule {}

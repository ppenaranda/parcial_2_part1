import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteEntity } from 'src/paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from 'src/medico/medico.entity/medico.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PacienteEntity, MedicoEntity])
  ],
  providers: [PacienteMedicoService],
  exports: [PacienteMedicoService],
})
export class PacienteMedicoModule {}

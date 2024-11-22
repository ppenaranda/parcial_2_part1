import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from 'src/paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from 'src/medico/medico.entity/medico.entity';

@Injectable()
export class PacienteMedicoService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  // Asignar un médico a un paciente
  async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<void> {
    const paciente = await this.pacienteRepository.findOne({ where: { id: pacienteId }, relations: ['medicos'] });
    const medico = await this.medicoRepository.findOne({ where: { id: medicoId } });

    if (!paciente || !medico) {
      throw new BadRequestException('Paciente o Médico no encontrado');
    }

    // Validación: Un paciente no puede tener más de 5 médicos
    if (paciente.medicos.length >= 5) {
      throw new BadRequestException('Un paciente no puede tener más de 5 médicos asignados');
    }

    // Agregar el médico al paciente
    paciente.medicos.push(medico);
    await this.pacienteRepository.save(paciente);
  }
}

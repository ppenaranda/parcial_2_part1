import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';

@Injectable()
export class PacienteMedicoService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  // Asociar un médico a un paciente
  async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<void> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['medicos'],
    });
    const medico = await this.medicoRepository.findOne({ where: { id: medicoId } });

    if (!paciente || !medico) {
      throw new BadRequestException('Paciente o Médico no encontrado');
    }

    // Verificar si el paciente ya tiene 5 médicos asignados
    if (paciente.medicos.length >= 5) {
      throw new BadRequestException('Un paciente no puede tener más de 5 médicos asignados');
    }

    // Asociar el médico con el paciente
    paciente.medicos.push(medico);
    await this.pacienteRepository.save(paciente);
  }

  // Obtener todos los médicos de un paciente
  async findMedicosByPacienteId(pacienteId: string): Promise<MedicoEntity[]> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['medicos'],
    });

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return paciente.medicos;
  }

  // Eliminar la relación entre un paciente y un médico
  async deleteMedicoFromPaciente(pacienteId: string, medicoId: string): Promise<void> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['medicos'],
    });

    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }

    const medicoIndex = paciente.medicos.findIndex(m => m.id === medicoId);

    if (medicoIndex === -1) {
      throw new NotFoundException('Médico no asociado al paciente');
    }

    // Eliminar la relación
    paciente.medicos.splice(medicoIndex, 1);
    await this.pacienteRepository.save(paciente);
  }
}

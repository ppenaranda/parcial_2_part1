import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity/medico.entity';
import { PacienteEntity } from 'src/paciente/paciente.entity/paciente.entity';

@Injectable()
export class MedicoService {
  constructor(
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
  ) {}

  async create(medico: MedicoEntity): Promise<MedicoEntity> {
    if (!medico.nombre || !medico.especialidad) {
      throw new BadRequestException('El nombre y la especialidad son obligatorios');
    }
    return await this.medicoRepository.save(medico);
  }

  async findOne(id: string): Promise<MedicoEntity> {
    const medico = await this.medicoRepository.findOne({ where: { id }, relations: ['pacientes'] });
    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }
    return medico;
  }

  async findAll(): Promise<MedicoEntity[]> {
    return await this.medicoRepository.find({ relations: ['pacientes'] });
  }

  async delete(id: string): Promise<void> {
    const medico = await this.findOne(id);

    if (medico.pacientes && medico.pacientes.length > 0) {
      throw new BadRequestException('No se puede eliminar un médico con pacientes asociados');
    }

    await this.medicoRepository.delete(id);
  }
}

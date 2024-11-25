import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity/diagnostico.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { PacienteMedicoService } from '../paciente-medico/paciente-medico.service';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
    private readonly pacienteMedicoService: PacienteMedicoService,
  ) {}

  async create(paciente: PacienteEntity): Promise<PacienteEntity> {
    if (!paciente.nombre || paciente.nombre.length < 3) {
      throw new BadRequestException('El nombre del paciente debe tener al menos 3 caracteres');
    }
    if (!['Masculino', 'Femenino'].includes(paciente.genero)) {
      throw new BadRequestException('El género del paciente debe ser Masculino o Femenino');
    }
    const exists = await this.pacienteRepository.findOne({ where: { nombre: paciente.nombre } });
    if (exists) {
      throw new BadRequestException('El paciente ya existe');
    }
    return await this.pacienteRepository.save(paciente);
  }

  async findOne(id: string): Promise<PacienteEntity> {
    const paciente = await this.pacienteRepository.findOne({ where: { id }, relations: ['diagnostico', 'medicos'] });
    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }
    return paciente;
  }

  async findAll(): Promise<PacienteEntity[]> {
    return await this.pacienteRepository.find({ relations: ['diagnostico', 'medicos'] });
  }

  async update(id: string, paciente: PacienteEntity): Promise<PacienteEntity> {
    const existingPaciente = await this.findOne(id); // Verificamos si el paciente existe

    // Actualizamos los campos del paciente
    existingPaciente.nombre = paciente.nombre;
    existingPaciente.genero = paciente.genero;

    return await this.pacienteRepository.save(existingPaciente); // Guardamos los cambios
  }

  async delete(id: string): Promise<void> {
    const paciente = await this.findOne(id);
    if (paciente.diagnostico && paciente.diagnostico.length > 0) {
      throw new BadRequestException('No se puede eliminar un paciente con diagnósticos asociados');
    }
    await this.pacienteRepository.delete(id);
  }

  async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<void> {
    try {
      await this.pacienteMedicoService.addMedicoToPaciente(pacienteId, medicoId);
    } catch (error) {
      throw new BadRequestException('No se pudo agregar el médico al paciente');
    }
  }
}

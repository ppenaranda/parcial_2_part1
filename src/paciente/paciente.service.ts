import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { DiagnosticoEntity } from 'src/diagnostico/diagnostico.entity/diagnostico.entity';
import { MedicoEntity } from 'src/medico/medico.entity/medico.entity';
import { PacienteMedicoService } from 'src/paciente-medico/paciente-medico.service'; // Importamos el servicio intermedio

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
    private readonly pacienteMedicoService: PacienteMedicoService, // Inyectamos el servicio intermedio
  ) {}

  // Método para crear un paciente
  async create(paciente: PacienteEntity): Promise<PacienteEntity> {
    if (!paciente.nombre || paciente.nombre.length < 3) {
      throw new BadRequestException('El nombre del paciente debe tener al menos 3 caracteres');
    }
    return await this.pacienteRepository.save(paciente);
  }

  // Método para encontrar un paciente por ID
  async findOne(id: string): Promise<PacienteEntity> {
    const paciente = await this.pacienteRepository.findOne({ where: { id }, relations: ['diagnostico', 'medicos'] });
    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }
    return paciente;
  }

  // Método para listar todos los pacientes
  async findAll(): Promise<PacienteEntity[]> {
    return await this.pacienteRepository.find({ relations: ['diagnostico', 'medicos'] });
  }

  // Método para eliminar un paciente (solo si no tiene diagnósticos asociados)
  async delete(id: string): Promise<void> {
    const paciente = await this.findOne(id);
    if (paciente.diagnostico && paciente.diagnostico.length > 0) {
      throw new BadRequestException('No se puede eliminar un paciente con diagnósticos asociados');
    }
    await this.pacienteRepository.delete(id);
  }

  // Método para agregar un médico a un paciente (delegado al servicio PacienteMedicoService)
  async addMedicoToPaciente(pacienteId: string, medicoId: string): Promise<void> {
    // Delegamos la lógica de agregar el médico al servicio intermedio
    await this.pacienteMedicoService.addMedicoToPaciente(pacienteId, medicoId);
  }
}

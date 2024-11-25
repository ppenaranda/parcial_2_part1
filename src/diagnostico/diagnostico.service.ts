import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';

@Injectable()
export class DiagnosticoService {
  constructor(
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    if (!diagnostico.descripcion || diagnostico.descripcion.length > 200) {
      throw new BadRequestException(
        'La descripción del diagnóstico no puede exceder los 200 caracteres',
      );
    }
    return await this.diagnosticoRepository.save(diagnostico);
  }

  async findOne(id: string): Promise<DiagnosticoEntity> {
    const diagnostico = await this.diagnosticoRepository.findOne({ where: { id } });
    if (!diagnostico) {
      throw new NotFoundException('Diagnóstico no encontrado');
    }
    return diagnostico;
  }

  async findAll(): Promise<DiagnosticoEntity[]> {
    return await this.diagnosticoRepository.find();
  }

  async update(id: string, diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    const existingDiagnostico = await this.findOne(id); // Verificamos si el diagnóstico existe

    // Actualizamos los campos del diagnóstico
    existingDiagnostico.descripcion = diagnostico.descripcion;

    return await this.diagnosticoRepository.save(existingDiagnostico); // Guardamos los cambios
  }

  async delete(id: string): Promise<void> {
    const diagnostico = await this.findOne(id);
    if (!diagnostico) {
      throw new NotFoundException('Diagnóstico no encontrado');
    }
    await this.diagnosticoRepository.delete(id);
  }
}

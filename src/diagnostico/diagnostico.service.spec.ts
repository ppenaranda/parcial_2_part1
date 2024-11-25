import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { DiagnosticoEntity } from './diagnostico.entity/diagnostico.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(
      getRepositoryToken(DiagnosticoEntity),
    );

    await repository.clear(); // Limpia la base de datos antes de cada prueba
  });

  it('Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Debe crear un diagnóstico correctamente', async () => {
      const diagnostico = {
        id: '1',
        nombre: 'Diagnóstico de prueba',
        descripcion: 'Diagnóstico inicial',
      } as DiagnosticoEntity;

      const result = await service.create(diagnostico);
      const storedDiagnostico = await repository.findOne({ where: { id: result.id } });

      expect(result).toEqual(storedDiagnostico);
      expect(storedDiagnostico.nombre).toEqual(diagnostico.nombre);
      expect(storedDiagnostico.descripcion).toEqual(diagnostico.descripcion);
    });

    it('Debe arrojar error si la descripción excede 200 caracteres', async () => {
      const diagnostico = {
        id: '1',
        nombre: 'Diagnóstico de prueba',
        descripcion: 'a'.repeat(201),
      } as DiagnosticoEntity;

      await expect(service.create(diagnostico)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('Debe retornar un diagnóstico por ID', async () => {
      const diagnostico = {
        id: '1',
        nombre: 'Diagnóstico de prueba',
        descripcion: 'Diagnóstico encontrado',
      } as DiagnosticoEntity;

      await repository.save(diagnostico);
      const result = await service.findOne(diagnostico.id);

      expect(result).toEqual(diagnostico);
    });

    it('Debe arrojar error si el diagnóstico no existe', async () => {
      await expect(service.findOne('999')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('Debe retornar todos los diagnósticos', async () => {
      const diagnosticos = [
        { id: '1', nombre: 'Diagnóstico 1', descripcion: 'Diagnóstico 1' },
        { id: '2', nombre: 'Diagnóstico 2', descripcion: 'Diagnóstico 2' },
      ] as DiagnosticoEntity[];

      await repository.save(diagnosticos);
      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].nombre).toBe('Diagnóstico 1');
    });
  });

  describe('delete', () => {
    it('Debe eliminar un diagnóstico correctamente', async () => {
      const diagnostico = {
        id: '1',
        nombre: 'Diagnóstico a eliminar',
        descripcion: 'Diagnóstico a eliminar',
      } as DiagnosticoEntity;

      await repository.save(diagnostico);
      await service.delete(diagnostico.id);

      const result = await repository.findOne({ where: { id: diagnostico.id } });
      expect(result).toBeNull();
    });

    it('Debe arrojar error si el diagnóstico no existe al intentar eliminar', async () => {
      await expect(service.delete('999')).rejects.toThrowError(NotFoundException);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { Repository } from 'typeorm';
import { MedicoEntity } from './medico.entity/medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;

  const mockMedicoRepo = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicoService,
        {
          provide: getRepositoryToken(MedicoEntity),
          useValue: mockMedicoRepo,
        },
      ],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
  });

  it('Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Debe crear un médico correctamente', async () => {
      const medico = {
        id: '1',
        nombre: 'Dr. Juan Pérez',
        especialidad: 'Cardiología',
      } as MedicoEntity;

      mockMedicoRepo.save.mockResolvedValue(medico);

      const result = await service.create(medico);
      expect(result).toEqual(medico);
      expect(mockMedicoRepo.save).toHaveBeenCalledWith(medico);
    });

    it('Debe arrojar error si el nombre o especialidad están vacíos', async () => {
      const medico = { id: '1', nombre: '', especialidad: '' } as MedicoEntity;

      await expect(service.create(medico)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('Debe retornar un médico por ID', async () => {
      const medico = { id: '1', nombre: 'Dr. Juan Pérez', especialidad: 'Cardiología' } as MedicoEntity;

      mockMedicoRepo.findOne.mockResolvedValue(medico);
      const result = await service.findOne(medico.id);
      expect(result).toEqual(medico);
    });

    it('Debe arrojar error si el médico no existe', async () => {
      mockMedicoRepo.findOne.mockResolvedValue(null);  // Cambiar aquí para simular que el médico no existe
      await expect(service.findOne('999')).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('Debe retornar todos los médicos', async () => {
      const medicos = [
        { id: '1', nombre: 'Dr. Juan Pérez', especialidad: 'Cardiología' },
        { id: '2', nombre: 'Dr. Ana Gómez', especialidad: 'Pediatría' },
      ] as MedicoEntity[];

      mockMedicoRepo.find.mockResolvedValue(medicos);
      const result = await service.findAll();
      expect(result).toEqual(medicos);
      expect(result.length).toBe(2);
    });
  });

  describe('delete', () => {
    it('Debe eliminar un médico correctamente', async () => {
      const medico = { id: '1', nombre: 'Dr. Juan Pérez', especialidad: 'Cardiología' } as MedicoEntity;
      mockMedicoRepo.findOne.mockResolvedValue(medico);
      mockMedicoRepo.delete.mockResolvedValue({});

      await service.delete(medico.id);
      expect(mockMedicoRepo.delete).toHaveBeenCalledWith(medico.id);
    });

    it('Debe arrojar error si el médico tiene pacientes asociados', async () => {
      const medico = {
        id: '1',
        nombre: 'Dr. Juan Pérez',
        especialidad: 'Cardiología',
        pacientes: [{}], // Simulando que tiene pacientes
      } as MedicoEntity;

      mockMedicoRepo.findOne.mockResolvedValue(medico); // Simula que se encontró el médico con pacientes asociados

      await expect(service.delete(medico.id)).rejects.toThrowError(BadRequestException);
    });
  });
});

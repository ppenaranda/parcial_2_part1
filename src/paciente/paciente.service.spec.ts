import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('PacienteService', () => {
  let service: PacienteService;
  let repo: Repository<PacienteEntity>;

  const mockPacienteRepo = {
    save: jest.fn(),
    findOne: jest.fn(), 
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getRepositoryToken(PacienteEntity),
          useValue: mockPacienteRepo,
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repo = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
  });

  it('Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Crea al paciente correctamente', async () => {
      const paciente = {
        id: '123',
        nombre: 'Juan Pérez',
        genero: 'Masculino',
        diagnostico: [],
        medicos: [],
      } as PacienteEntity;

  
      mockPacienteRepo.save.mockResolvedValue(paciente);

      const result = await service.create(paciente);

      expect(result).toEqual(paciente);
      expect(mockPacienteRepo.save).toHaveBeenCalledWith(paciente);
    });

    it('Debería arrojar error cuando el nombre del paciente tiene menos de 3 caracteres', async () => {
      const paciente = {
        id: '123',
        nombre: 'Ju',
        genero: 'Masculino',
        diagnostico: [],
        medicos: [],
      } as PacienteEntity;

      await expect(service.create(paciente)).rejects.toThrowError(
        new BadRequestException('El nombre del paciente debe tener al menos 3 caracteres'),
      );

      expect(mockPacienteRepo.save).not.toHaveBeenCalled();
    });
  });
});

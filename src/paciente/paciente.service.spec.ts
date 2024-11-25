import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PacienteEntity } from './paciente.entity/paciente.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PacienteMedicoService } from '../paciente-medico/paciente-medico.service';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;

  // Mock básico para PacienteMedicoService
  const mockPacienteMedicoService = {
    addMedicoToPaciente: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        PacienteService,
        {
          provide: PacienteMedicoService,
          useValue: mockPacienteMedicoService, // Proveer el mock
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(
      getRepositoryToken(PacienteEntity),
    );

    await repository.clear();
  });

  it('Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Crea al paciente correctamente', async () => {
      const paciente = { id: '123', nombre: 'Juan Pérez', genero: 'Masculino' } as PacienteEntity;

      const result = await service.create(paciente);
      const storedPaciente = await repository.findOne({ where: { id: paciente.id } });

      expect(result).toEqual(storedPaciente);
      expect(storedPaciente.nombre).toEqual(paciente.nombre);
    });

    it('Debería arrojar error si el nombre es menor a 3 caracteres', async () => {
      const paciente = { id: '123', nombre: 'Ju', genero: 'Masculino' } as PacienteEntity;

      await expect(service.create(paciente)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});

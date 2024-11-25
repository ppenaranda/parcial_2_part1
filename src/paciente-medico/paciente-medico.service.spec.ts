import { Test, TestingModule } from '@nestjs/testing';
import { PacienteMedicoService } from './paciente-medico.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PacienteEntity } from '../paciente/paciente.entity/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity/medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;

  const mockPacienteRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockMedicoRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteMedicoService,
        {
          provide: getRepositoryToken(PacienteEntity),
          useValue: mockPacienteRepo,
        },
        {
          provide: getRepositoryToken(MedicoEntity),
          useValue: mockMedicoRepo,
        },
      ],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(
      getRepositoryToken(PacienteEntity),
    );
    medicoRepository = module.get<Repository<MedicoEntity>>(
      getRepositoryToken(MedicoEntity),
    );
  });

  it('Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('addMedicoToPaciente', () => {
    it('Debe asignar un médico al paciente', async () => {
      const paciente = {
        id: '1',
        nombre: 'Juan Pérez',
        medicos: [],
      } as PacienteEntity;

      const medico = { id: '1', nombre: 'Dr. Juan Pérez' } as MedicoEntity;

      mockPacienteRepo.findOne.mockResolvedValue(paciente);
      mockMedicoRepo.findOne.mockResolvedValue(medico);
      mockPacienteRepo.save.mockResolvedValue(paciente);

      await service.addMedicoToPaciente(paciente.id, medico.id);

      expect(paciente.medicos).toContain(medico);
    });

    it('Debe arrojar error si el paciente tiene más de 5 médicos', async () => {
      const paciente = {
        id: '1',
        nombre: 'Juan Pérez',
        medicos: new Array(5), // Simula que ya tiene 5 médicos asignados
      } as PacienteEntity;

      const medico = { id: '6', nombre: 'Dr. Ana Gómez' } as MedicoEntity;

      mockPacienteRepo.findOne.mockResolvedValue(paciente);
      mockMedicoRepo.findOne.mockResolvedValue(medico);

      await expect(service.addMedicoToPaciente(paciente.id, medico.id)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('Debe arrojar error si el paciente o el médico no existen', async () => {
      mockPacienteRepo.findOne.mockResolvedValue(null);
      mockMedicoRepo.findOne.mockResolvedValue(null);

      await expect(service.addMedicoToPaciente('1', '1')).rejects.toThrowError(BadRequestException);
    });
  });
});

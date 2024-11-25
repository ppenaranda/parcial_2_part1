import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { PacienteEntity } from 'src/paciente/paciente.entity/paciente.entity';

describe('MedicoService', () => {
  let service: MedicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicoService],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

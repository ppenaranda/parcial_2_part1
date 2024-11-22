import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicoModule } from './medico/medico.module';
import { PacienteModule } from './paciente/paciente.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { PacienteMedicoModule } from './paciente-medico/paciente-medico.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from './medico/medico.entity/medico.entity';
import { PacienteEntity } from './paciente/paciente.entity/paciente.entity';
import { DiagnosticoEntity } from './diagnostico/diagnostico.entity/diagnostico.entity';

@Module({
  imports: [
    MedicoModule,
    PacienteModule,
    DiagnosticoModule,
    PacienteMedicoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', 
      port: 5432, 
      username: 'postgres',
      password: 'postgres',
      database: 'mi_base_de_datos',
      entities: [
        MedicoEntity, 
        PacienteEntity, 
        DiagnosticoEntity, 
      ],
      synchronize: true, 
      dropSchema: false, 
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

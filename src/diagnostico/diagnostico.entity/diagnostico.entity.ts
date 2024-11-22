

import { PacienteEntity } from "src/paciente/paciente.entity/paciente.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DiagnosticoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @ManyToMany(()=> PacienteEntity, paciente => paciente.diagnostico)
    pacientes: PacienteEntity[];
}
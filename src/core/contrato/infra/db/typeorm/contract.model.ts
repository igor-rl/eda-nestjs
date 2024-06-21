import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type IContractModel = {
  id: string;
  id_modulo: string;
  modulo_name: string;
  modulo_active: boolean;
};

@Entity({ name: 'contrato' })
export class ContractModel implements IContractModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  id_modulo: string;

  @Column({ name: 'modulo_name' })
  modulo_name: string;

  @Column({ default: true })
  modulo_active: boolean;
}

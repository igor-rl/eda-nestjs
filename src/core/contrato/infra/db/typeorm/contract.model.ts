import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type IContractModel = {
  id: string;
  id_api: string;
  api_name: string;
  api_active: boolean;
};

@Entity({ name: 'contrato' })
export class ContractModel implements IContractModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  id_api: string;

  @Column({ name: 'api_name' })
  api_name: string;

  @Column({ default: true })
  api_active: boolean;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ContractModel } from '../../../../contrato/infra/db/typeorm/contract.model';

export interface IUserPermissionModel {
  id: string;
  id_contract: string;
  id_user: string;
  id_permission: string;
  modulo_name: string;
}

@Entity({ name: 'user-permission' })
@Unique(['id_contract', 'id_user', 'id_permission'])
export class UserPermissionModel implements IUserPermissionModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'id_contract', nullable: false })
  id_contract: string;

  @Column({ type: 'uuid', name: 'id_user', nullable: false })
  id_user: string;

  @Column({
    name: 'id_permission',
    nullable: false,
  })
  id_permission: string;

  @Column({ name: 'modulo_name', nullable: false, unique: false })
  modulo_name: string;

  // recebe relacionamento contrato
  @ManyToOne(() => ContractModel, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'id_contract' })
  contract?: ContractModel;
}

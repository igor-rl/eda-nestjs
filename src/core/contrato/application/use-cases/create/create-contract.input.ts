import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';

export type CreateContractInputConstructorProps = {
  id_contract: string;
  id_modulo: string;
  modulo_name: string;
  modulo_active?: boolean;
};

export class CreateContractInput {
  @ApiProperty({
    name: 'id_contract',
    type: String,
    required: true,
    example: 'f7f1f1b4-0b1b-4b7b-8b3b-0b1b4b7b8b3b',
  })
  @IsUUID('4')
  @IsNotEmpty()
  id_contract: string;

  @ApiProperty({
    name: 'id_modulo',
    type: String,
    required: true,
    example: 'f7f1f1b4-0b1b-4b7b-8b3b-0b1b4b7b8b3b',
  })
  @IsUUID('4')
  @IsNotEmpty()
  id_modulo: string;

  @ApiProperty({
    name: 'modulo_name',
    type: String,
    required: true,
    example: 'Filial 1',
  })
  @IsString()
  @IsNotEmpty()
  modulo_name: string;

  @ApiProperty({
    name: 'modulo_active',
    type: Boolean,
    required: false,
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  modulo_active?: boolean;

  constructor(props?: CreateContractInputConstructorProps) {
    if (!props) return;
    this.id_contract = props.id_contract;
    this.id_modulo = props.id_modulo;
    this.modulo_name = props.modulo_name;
    this.modulo_active = props.modulo_active;
  }
}

export class ValidateContractInput {
  static validate(input: CreateContractInput) {
    return validateSync(input);
  }
}

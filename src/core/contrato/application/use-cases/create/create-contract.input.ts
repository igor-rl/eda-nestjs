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
  id_api: string;
  api_name: string;
  api_active?: boolean;
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
    name: 'id_api',
    type: String,
    required: true,
    example: 'f7f1f1b4-0b1b-4b7b-8b3b-0b1b4b7b8b3b',
  })
  @IsUUID('4')
  @IsNotEmpty()
  id_api: string;

  @ApiProperty({
    name: 'api_name',
    type: String,
    required: true,
    example: 'Filial 1',
  })
  @IsString()
  @IsNotEmpty()
  api_name: string;

  @ApiProperty({
    name: 'api_active',
    type: Boolean,
    required: false,
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  api_active?: boolean;

  constructor(props?: CreateContractInputConstructorProps) {
    if (!props) return;
    this.id_contract = props.id_contract;
    this.id_api = props.id_api;
    this.api_name = props.api_name;
    this.api_active = props.api_active;
  }
}

export class ValidateContractInput {
  static validate(input: CreateContractInput) {
    return validateSync(input);
  }
}

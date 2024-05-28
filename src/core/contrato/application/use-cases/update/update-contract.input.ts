import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  validateSync,
  IsUUID,
} from 'class-validator';

export type UpdateContractContructorProps = {
  id: string;
  api_active: boolean;
};

export class UpdateContractInput {
  @ApiProperty({
    name: 'id',
    type: String,
    required: true,
    example: 'f7f1f1b4-0b1b-4b7b-8b3b-0b1b4b7b8b3b',
  })
  @IsUUID('4')
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    name: 'api_active',
    required: false,
    type: Boolean,
    default: null,
  })
  @IsBoolean()
  @IsOptional()
  api_active: boolean;

  constructor(props?: UpdateContractContructorProps) {
    if (!props) return;
    this.id = props.id;
    this.api_active = props.api_active;
  }
}

export class ValidateContractInput {
  static validate(input: UpdateContractInput) {
    return validateSync(input);
  }
}

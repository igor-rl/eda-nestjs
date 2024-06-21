import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
  validateSync,
} from 'class-validator';
import { ListInput } from '../../../../shared/application/use-cases/list-use-case';

export class ListContractsFilter {
  @IsOptional()
  @IsString()
  id_user_master?: string | null;
  @IsOptional()
  @IsString()
  id_modulo?: string | null;
  @IsOptional()
  @IsString()
  name?: string | null;
  @IsOptional()
  @IsString()
  description?: string | null;
  @IsOptional()
  @IsBoolean()
  is_active?: boolean | null;
}

const filterExample: ListContractsFilter = {
  id_user_master: null,
  id_modulo: null,
  name: null,
  description: null,
  is_active: null,
};

export class ListContractsInput extends ListInput<ListContractsFilter> {
  @ValidateNested()
  @ApiProperty({
    description: `Filtrar grupo de empresas.
    id_user_master: string;
    name: string;
    description: string;
    is_active: boolean;`,
    required: false,
    type: 'object',
    example: {
      filter: filterExample,
    },
  })
  filter?: ListContractsFilter;
}

export class ValidateListContractsInput {
  static validate(input: ListContractsInput) {
    return validateSync(input);
  }
}

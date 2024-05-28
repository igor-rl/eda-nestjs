import { ApiProperty } from '@nestjs/swagger';
import { SearchInput } from '../search-input';
import { SortDirection } from '../../domain/repository/search-params';

export abstract class ListInput<Filter> implements SearchInput<Filter> {
  @ApiProperty({
    name: 'page',
    description: 'Selecione a página corrente',
    required: false,
    type: Number,
    default: 1,
    example: null,
  })
  page?: number;

  @ApiProperty({
    name: 'per_page',
    description: 'Selecione a quantidade de itens por página',
    required: false,
    type: Number,
    default: 10,
    example: null,
  })
  per_page?: number;

  @ApiProperty({
    name: 'sort',
    description: 'Selecione o campo para ordenação',
    required: false,
    type: String,
    default: 'created_at',
    example: null,
  })
  sort?: string;

  @ApiProperty({
    name: 'sort_dir',
    description: 'Selecione a direção da ordenação',
    required: false,
    type: String,
    default: 'desc',
    example: null,
  })
  sort_dir?: SortDirection;
  filter?: Filter;
}

import { validateSync } from 'class-validator';
import {
  ListContractsFilter,
  ListContractsInput,
} from '../list-contract.input';

describe('ListContractsInput Unit Tests', () => {
  it('Deve validar ListContractsInput', () => {
    const input = new ListContractsInput();
    input.page = 1;
    input.per_page = 10;
    input.sort = 'name';
    input.sort_dir = 'asc';

    const filter = new ListContractsFilter();
    input.filter = filter;
    let errors = validateSync(input);
    expect(errors).toHaveLength(0);

    filter.name = 'Nome Exemplo';
    filter.id_user_master = '4b91e890-7e14-4b15-94cd-9126c0e6eaa0';
    filter.description = 'Descrição Exemplo';
    filter.is_active = true;
    input.filter = filter;

    errors = validateSync(input);
    expect(errors).toHaveLength(0);
  });
  it('Deve retornar erro ao validar ListContractsInput', () => {
    const input = new ListContractsInput();
    input.page = 1;
    input.per_page = 10;
    input.sort = 'name';
    input.sort_dir = 'asc';

    const filter = new ListContractsFilter();
    input.filter = filter;
    let errors = validateSync(input);
    expect(errors).toHaveLength(0);

    filter.id_user_master = 1 as unknown as string;
    filter.name = 1 as unknown as string;
    filter.description = 1 as unknown as string;
    filter.is_active = 1 as unknown as boolean;

    input.filter = filter;
    errors = validateSync(input);
    expect(errors).toHaveLength(1);
    expect(errors[0].children).toHaveLength(4);
    expect(errors[0].children[0].constraints).toMatchObject({
      isString: 'id_user_master must be a string',
    });
    expect(errors[0].children[1].constraints).toMatchObject({
      isString: 'name must be a string',
    });
    expect(errors[0].children[2].constraints).toMatchObject({
      isString: 'description must be a string',
    });
    expect(errors[0].children[3].constraints).toMatchObject({
      isBoolean: 'is_active must be a boolean value',
    });
  });
});

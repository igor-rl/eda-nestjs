import { Address, AddressInvalidError } from '../address.vo';

describe('Address unit tests', () => {
  it('should create a valid Address instance', () => {
    const address = Address.create({
      street: 'Rua Teste',
      number: 123,
      neighborhood: 'Bairro',
      city: 'Cidade',
      state: 'SP',
      zip: '12345-678',
    });
    expect(address.ok).toBeTruthy();
    expect(address.ok.toJSON()).toEqual({
      street: 'Rua Teste',
      number: 123,
      neighborhood: 'Bairro',
      city: 'Cidade',
      state: 'SP',
      zip: '12345-678',
    });
    expect(address.error).toBeFalsy();
  });
  it('should return required errors', () => {
    const address = Address.create({
      street: null,
      number: null,
      neighborhood: null,
      city: null,
      state: null,
      zip: null,
    });
    expect(address.ok).toBeFalsy();
    expect(address.error).toBeTruthy();
    expect(address.error).toEqual(
      new AddressInvalidError(
        'Street is required, Number is required, Number must be greater than 0, Neighborhood is required, City is required, State is required, Zip is required, Zip must be in format XXXXX-XXX',
      ),
    );
  });
  it('shoud return invalid zip error', () => {
    const address = Address.create({
      street: 'Rua Teste',
      number: 123,
      neighborhood: 'Bairro',
      city: 'Cidade',
      state: 'SP',
      zip: '12345678',
    });
    expect(address.ok).toBeFalsy();
    expect(address.error).toBeTruthy();
    expect(address.error).toEqual(
      new AddressInvalidError('Zip must be in format XXXXX-XXX'),
    );
  });
});

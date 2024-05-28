import { Either } from '../either';
import { ValueObject } from '../value-object';

export type AddressProps = {
  street: string;
  number: number;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  complement?: string;
};

export class Address extends ValueObject {
  street: string;
  number: number;
  city: string;
  neighborhood: string;
  state: string;
  zip: string;
  complement?: string;
  constructor(props: AddressProps) {
    super();
    this.street = props.street;
    this.number = props.number;
    this.neighborhood = props.neighborhood;
    this.city = props.city;
    this.state = props.state;
    this.zip = props.zip;
    this.complement = props.complement;
    this.validate();
  }

  static create(data: AddressProps): Either<Address, AddressInvalidError> {
    return Either.safe(() => new Address(data));
  }

  private validate() {
    const errors = [];
    !this.street && errors.push('Street is required');
    !this.number && errors.push('Number is required');
    this.number < 1 && errors.push('Number must be greater than 0');
    !this.neighborhood && errors.push('Neighborhood is required');
    !this.city && errors.push('City is required');
    !this.state && errors.push('State is required');
    this.state &&
      this.state.length !== 2 &&
      errors.push('State must have 2 characters');
    !this.zip && errors.push('Zip is required');
    !/^\d{5}-\d{3}$/.test(this.zip) &&
      errors.push('Zip must be in format XXXXX-XXX');
    if (errors.length) {
      throw new AddressInvalidError(errors.join(', '));
    }
  }

  toJSON() {
    return {
      street: this.street,
      number: this.number,
      neighborhood: this.neighborhood,
      city: this.city,
      state: this.state,
      zip: this.zip,
      complement: this.complement,
    };
  }

  toString() {
    return `${this.street}, ${this.number}${this.complement ? `, ${this.complement}` : ''}, ${this.neighborhood}, ${this.city}, ${this.state}, ${this.zip}`;
  }
}

export class AddressInvalidError extends Error {
  constructor(message?: string) {
    super(message || 'Invalid data to create Address');
    this.name = 'AddressInvalidFormatError';
  }
}

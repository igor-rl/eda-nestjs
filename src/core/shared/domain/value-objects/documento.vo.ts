import { Either } from '../either';
import { ValueObject } from '../value-object';

export enum TipoDocumento {
  CPF = 1,
  CNPJ = 2,
}

export class IDocumento {
  numero: string;
  tipoDoc: TipoDocumento;
}

export class Documento extends ValueObject {
  private tipoDocumento: TipoDocumento;

  constructor(readonly numero: string) {
    super();
    this.numero = numero;
    this.validate();
  }

  static create(
    numero: string,
  ): Either<Documento, DocumentoFormatoInvalidoError> {
    return Either.safe(() => new Documento(numero));
  }

  private validate() {
    if (!this.numero) {
      throw new DocumentoFormatoInvalidoError('Documento não definido');
    }
    /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(this.numero) && this.documentoAsCPF();
    /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(this.numero) &&
      this.documentoAsCNPJ();
    if (!this.tipoDocumento) {
      throw new DocumentoFormatoInvalidoError(
        `O documento infomado '${this.numero}' não está no formato esperado de CPF(000.000.000-00) ou de CNPJ(00.000.000/0000-00)`,
      );
    }
  }

  private documentoAsCPF(): void {
    this.tipoDocumento = TipoDocumento.CPF;
  }

  private documentoAsCNPJ(): void {
    this.tipoDocumento = TipoDocumento.CNPJ;
  }

  get tipoDoc(): TipoDocumento {
    return this.tipoDocumento;
  }

  getNumero(): string {
    return this.numero;
  }
}

export class DocumentoFormatoInvalidoError extends Error {
  constructor(message?: string) {
    super(message || 'O documento informato é inválido');
    this.name = 'DocumentoFormatoInvalidoError';
  }
}

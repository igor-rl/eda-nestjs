import {
  Documento,
  DocumentoFormatoInvalidoError,
  TipoDocumento,
} from '../documento.vo';

describe('Documento Unit Tests', () => {
  let validateSpy: jest.SpyInstance;
  let documentoAsCPF: jest.SpyInstance;
  let documentoAsCNPJ: jest.SpyInstance;

  beforeEach(() => {
    validateSpy = jest.spyOn(Documento.prototype as any, 'validate');
    documentoAsCPF = jest.spyOn(Documento.prototype as any, 'documentoAsCPF');
    documentoAsCNPJ = jest.spyOn(Documento.prototype as any, 'documentoAsCNPJ');
  });

  afterEach(() => {
    validateSpy.mockClear();
    documentoAsCPF.mockClear();
    documentoAsCNPJ.mockClear();
  });

  it('deve lançar um erro ao tentar criar um documento com formato inválido', () => {
    const [vo, error] = Documento.create('00.000.000/0000-0').asArray();
    expect(vo).toBeNull();
    expect(error).toEqual(
      new DocumentoFormatoInvalidoError(
        `O documento infomado '00.000.000/0000-0' não está no formato esperado de CPF(000.000.000-00) ou de CNPJ(00.000.000/0000-00)`,
      ),
    );
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(documentoAsCPF).not.toHaveBeenCalled();
    expect(documentoAsCNPJ).not.toHaveBeenCalled();
  });

  it('deve lançar um erro ao tentar criar um documento nulo', () => {
    const [vo, error] = Documento.create(null).asArray();
    expect(vo).toBeNull();
    expect(error).toEqual(
      new DocumentoFormatoInvalidoError('Documento não definido'),
    );
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(documentoAsCPF).not.toHaveBeenCalled();
    expect(documentoAsCNPJ).not.toHaveBeenCalled();
  });

  it('deve lançar um erro ao tentar criar um documento undefined', () => {
    const [vo, error] = Documento.create(undefined).asArray();
    expect(vo).toBeNull();
    expect(error).toEqual(
      new DocumentoFormatoInvalidoError('Documento não definido'),
    );
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(documentoAsCPF).not.toHaveBeenCalled();
    expect(documentoAsCNPJ).not.toHaveBeenCalled();
  });

  it('deve lançar um erro ao tentar criar um documento vazio', () => {
    const [vo, error] = Documento.create('').asArray();
    expect(vo).toBeNull();
    expect(error).toEqual(
      new DocumentoFormatoInvalidoError('Documento não definido'),
    );
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(documentoAsCPF).not.toHaveBeenCalled();
    expect(documentoAsCNPJ).not.toHaveBeenCalled();
  });

  it('deve criar um novo CPF', () => {
    const [vo, error] = Documento.create('000.000.000-00').asArray();
    expect(vo.numero).toBe('000.000.000-00');
    expect(vo.tipoDoc).toBe(TipoDocumento.CPF);
    expect(error).toBeNull();
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(documentoAsCPF).toHaveBeenCalledTimes(1);
    expect(documentoAsCNPJ).not.toHaveBeenCalled();
  });

  it('deve criar um novo CNPJ', () => {
    const [vo, error] = Documento.create('00.000.000/0000-00').asArray();
    expect(vo.numero).toBe('00.000.000/0000-00');
    expect(vo.tipoDoc).toBe(TipoDocumento.CNPJ);
    expect(error).toBeNull();
    expect(validateSpy).toHaveBeenCalledTimes(1);
    expect(documentoAsCPF).not.toHaveBeenCalled();
    expect(documentoAsCNPJ).toHaveBeenCalledTimes(1);
  });
});

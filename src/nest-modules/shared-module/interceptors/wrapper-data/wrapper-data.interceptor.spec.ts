import { lastValueFrom, of } from 'rxjs';
import { WrapperDataInterceptor } from './wrapper-data.interceptor';

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
  });

  it('should be defined', async () => {
    expect(interceptor).toBeDefined();
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ name: 'test' }),
    });
    const result = await lastValueFrom(obs$);
    expect(result).toEqual({ data: { name: 'test' } });
  });

  it('should not wramper when meta key is present', async () => {
    expect(interceptor).toBeDefined();
    const data = { name: 'test', meta: { key: 'value' } };
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(data),
    });
    const result = await lastValueFrom(obs$);
    expect(result).toEqual(data);
  });
});

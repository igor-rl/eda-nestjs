import { UserPermission } from '../user-permissions.entity';

describe('UserPermissionFakeBuilder', () => {
  it('error on called', () => {
    const faker = UserPermission.fake().anUserPermission().build();
    expect(faker.toJSON()).toStrictEqual({
      id_user_permission: expect.any(String),
      id_contract: expect.any(String),
      id_user: expect.any(String),
      id_permission: expect.any(String),
      api_name: expect.any(String),
    });
  });
});

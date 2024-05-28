import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { KeycloakStrategy } from './strategies/keycloak.strategy';
import { PassportModule } from '@nestjs/passport';
import { KeycloakAuthGuard } from './auth.guard';
import { FindUserPermissionsUseCase } from '../../core/user-permission/application/use-cases/find/find-user-permissions.use-case';
import { UsersPermissionsModule } from '../users-permissions-model/users-permissions.module';
import { IUserPermissionRepository } from '../../core/user-permission/domain/user-permission-interface.repository';
import { USERS_PERMISSIONS_PROVIDERS } from '../users-permissions-model/users-permissions.providers';

@Global()
@Module({
  imports: [
    PassportModule.register({}),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          privateKey: configService.get('JWT_PRIVATE_KEY'),
          publicKey: configService.get('JWT_PUBLIC_KEY'),
          signOptions: {
            algorithm: 'RS256',
          },
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    UsersPermissionsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    KeycloakStrategy,
    KeycloakAuthGuard,
    {
      provide: FindUserPermissionsUseCase,
      useFactory: (repository: IUserPermissionRepository) => {
        return new FindUserPermissionsUseCase(repository);
      },
      inject: [
        USERS_PERMISSIONS_PROVIDERS.REPOSITORIES.USER_PERMISSION_REPOSITORY
          .provide,
      ],
    },
  ],
  exports: [AuthService, KeycloakStrategy, PassportModule],
})
export class AuthModule {}

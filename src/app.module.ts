import { Module } from '@nestjs/common';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { EventModule } from './nest-modules/event-module/event.module';
import { UseCaseModule } from './nest-modules/use-case-module/use-case.module';
import { RabbitmqModule } from './nest-modules/rabbitmq-module/rabbitmq.module';
import { UsersPermissionsModule } from './nest-modules/users-permissions-model/users-permissions.module';
import { ContractsModule } from './nest-modules/contracts-module/contract.module';
import { AuthModule } from './nest-modules/auth-module/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    EventModule,
    UseCaseModule,
    RabbitmqModule.forRoot(),
    AuthModule,
    UsersPermissionsModule,
    ContractsModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import {
  ConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import Joi from 'joi';
import { join } from 'path';

type DB_SCHEMA_TYPE = {
  DB_VENDOR: 'mysql' | 'postgres' | 'sqlite';
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_LOGGING: boolean;
  SYNCHRONIZE: boolean;
};

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_VENDOR: Joi.string().required().valid('mysql', 'postgres', 'sqlite'),
  DB_HOST: Joi.string().when('DB_VENDOR', {
    is: ['postgres', 'mysql'],
    then: Joi.required(),
  }),
  DB_DATABASE: Joi.string().when('DB_VENDOR', {
    is: ['postgres', 'mysql'],
    then: Joi.required(),
  }),
  DB_USERNAME: Joi.string().when('DB_VENDOR', {
    is: ['postgres', 'mysql'],
    then: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when('DB_VENDOR', {
    is: ['postgres', 'mysql'],
    then: Joi.required(),
  }),
  DB_PORT: Joi.number()
    .integer()
    .when('DB_VENDOR', {
      is: ['postgres', 'mysql'],
      then: Joi.required(),
    }),
  DB_LOGGING: Joi.boolean().required(),
  SYNCHRONIZE: Joi.boolean().when('DB_VENDOR', {
    is: ['sqlite', 'mysql', 'postgres'],
    then: Joi.required(),
  }),
};

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE;

// rabbitmq
type CONFIG_RABBITMQ_SCHEMA_TYPE = {
  RABBITMQ_URI: string;
  RABBITMQ_REGISTER_HANDLERS: boolean;
};

export const CONFIG_RABBITMQ_SCHEMA: Joi.StrictSchemaMap<CONFIG_RABBITMQ_SCHEMA_TYPE> =
  {
    RABBITMQ_URI: Joi.string().required(),
    RABBITMQ_REGISTER_HANDLERS: Joi.boolean().required(),
  };

// jwt
type CONFIG_JWT_SCHEMA_TYPE = {
  JWT_PUBLIC_KEY: string;
  JWT_PRIVATE_KEY: string;
};

export const CONFIG_JWT_SCHEMA: Joi.StrictSchemaMap<CONFIG_JWT_SCHEMA_TYPE> = {
  JWT_PUBLIC_KEY: Joi.string().required(),
  JWT_PRIVATE_KEY: Joi.string().optional(),
};

// keycloak
export type KEYCLOAK_SCHEMA_TYPE = {
  KEYCLOAK_URL: string;
  KEYCLOAK_ADMIN_USERNAME: string;
  KEYCLOAK_ADMIN_PASSWORD: string;
  KEYCLOAK_ADMIN_CLIENT_ID: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_ADMIN_CLIENT_SECRET: string;
};

export const CONFIG_KEYCLOAK_SCHEMA: Joi.StrictSchemaMap<KEYCLOAK_SCHEMA_TYPE> =
  {
    KEYCLOAK_URL: Joi.string().required(),
    KEYCLOAK_ADMIN_USERNAME: Joi.string().required(),
    KEYCLOAK_ADMIN_PASSWORD: Joi.string().required(),
    KEYCLOAK_ADMIN_CLIENT_ID: Joi.string().required(),
    KEYCLOAK_REALM: Joi.string().required(),
    KEYCLOAK_ADMIN_CLIENT_SECRET: Joi.string().required(),
  };

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}) {
    const { envFilePath, ...otherOptions } = options;
    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath! : [envFilePath!]),
        join(process.cwd(), 'envs', `.env.${process.env.NODE_ENV!}`),
        join(process.cwd(), 'envs', `.env`),
      ],
      validationSchema: Joi.object({
        ...CONFIG_DB_SCHEMA,
        ...CONFIG_RABBITMQ_SCHEMA,
        ...CONFIG_JWT_SCHEMA,
        ...CONFIG_KEYCLOAK_SCHEMA,
      }),
      ...otherOptions,
    });
  }
}

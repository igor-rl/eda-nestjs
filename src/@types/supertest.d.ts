import { INestApplication } from '@nestjs/common';
import superagent from 'superagent';

declare module 'supertest' {
  interface Test extends superagent.SuperAgentRequest {
    authenticate(app: INestApplication, forceAdmin?: boolean): this;
  }
}

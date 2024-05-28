import { Global, Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { DomainEventMediator } from '../../core/shared/domain/events/domain-event-mediator';
// import { FakeService } from './fake.service';
// import { FakeController } from './fake.controller';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  // controllers: [FakeController],
  providers: [
    // FakeService,
    {
      provide: DomainEventMediator,
      useFactory: (eventEmitter: EventEmitter2) => {
        return new DomainEventMediator(eventEmitter);
      },
      inject: [EventEmitter2],
    },
  ],
  exports: [DomainEventMediator],
})
export class EventModule {}

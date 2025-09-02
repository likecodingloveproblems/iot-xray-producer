import { Module } from '@nestjs/common';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { ProducerModule } from './producer/producer.module';

@Module({
  imports: [RabbitmqModule, ProducerModule],
})
export class AppModule {}

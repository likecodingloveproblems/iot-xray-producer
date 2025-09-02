import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Module({
  providers: [ProducerService, RabbitMQService],
  exports: [ProducerService],
})
export class ProducerModule {}

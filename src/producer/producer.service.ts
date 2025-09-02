import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import sampleData from '../../sample-data.json';

@Injectable()
export class ProducerService implements OnModuleInit {
  private readonly logger = new Logger(ProducerService.name);

  constructor(private readonly rabbitMQService: RabbitMQService) {}
  onModuleInit() {
    setInterval(() => {
      this.sendXRayData();
    }, 1000);
  }

  async sendXRayData() {
    await this.rabbitMQService.sendToQueue('xray_queue', sampleData);
    this.logger.log('X-ray data produced');
  }
}

import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private connectionString =
    process.env.RABBITMQ_URI || 'amqp://user:password@localhost:5672';
  private readonly queues = ['xray_queue'];

  public ready: Promise<void>;

  async onModuleInit() {
    this.ready = this.connectAndAssert();
    await this.ready;
  }
  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  private async connectAndAssert() {
    this.connection = await amqp.connect(this.connectionString);
    this.channel = await this.connection.createChannel();
    this.logger.log('Connected to RabbitMQ');

    for (const queue of this.queues) {
      await this.channel.assertQueue(queue, { durable: true });
      this.logger.log(`Queue asserted: ${queue}`);
    }
  }

  async sendToQueue(queue: string, message: any) {
    await this.ready;
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    this.logger.log(
      `Message sent to queue ${queue}: ${JSON.stringify(message)}`,
    );
  }
}

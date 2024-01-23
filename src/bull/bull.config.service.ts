import { SharedBullConfigurationFactory } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueueOptions } from 'bullmq';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  constructor(private readonly config: ConfigService) {}

  createSharedConfiguration(): QueueOptions | Promise<QueueOptions> {
    return {
      connection: {
        host: this.config.get('QUEUE_REDIS_HOST'),
        port: this.config.get('QUEUE_REDIS_PORT'),
      },
      prefix: this.config.get('QUEUE_PREFIX'),
    };
  }
}

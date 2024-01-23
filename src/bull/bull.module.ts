import { Module } from '@nestjs/common';
import { BullModule as BullOriginModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { BullConfigService } from './bull.config.service';

@Module({
  imports: [
    BullOriginModule.forRootAsync({
      imports: [ConfigModule],
      useClass: BullConfigService,
    }),
    BullOriginModule.registerQueue({
      name: 'event',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  exports: [BullOriginModule],
})
export class BullModule {}

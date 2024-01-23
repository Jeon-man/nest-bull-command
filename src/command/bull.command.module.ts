import { Module } from '@nestjs/common';
import { BullRootCommand } from './bull.command';
import { BullModule } from '@nestjs/bullmq';

@Module({
  providers: [BullRootCommand],
})
export class BullCommandModule {}

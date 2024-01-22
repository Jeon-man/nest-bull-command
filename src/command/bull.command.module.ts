import { Module } from '@nestjs/common';
import { BullRootCommand } from './bull.command';

@Module({
  providers: [BullRootCommand],
})
export class BullCommandModule {}

import { Module } from '@nestjs/common';
import { BullRootCommand } from './bull.command';
import { BullModule } from 'src/bull/bull.module';

@Module({
  imports: [BullModule],
  providers: [...BullRootCommand.registerWithSubCommands()],
})
export class BullCommandModule {}

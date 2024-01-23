import { InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Command, CommandRunner } from 'nest-commander';
import { BullJobCommand } from './subCommand/bull.jobs.command';

@Command({
  name: 'bull',
  description: 'bull manage root command',
  subCommands: [BullJobCommand],
})
export class BullRootCommand extends CommandRunner {
  constructor(@InjectQueue('event') private readonly eventQueue: Queue) {
    super();
  }

  async run(options?: Record<string, any>): Promise<void> {
    Logger.log('Bull manage root command', {
      state: !(await this.eventQueue.isPaused()),
    });
  }
}

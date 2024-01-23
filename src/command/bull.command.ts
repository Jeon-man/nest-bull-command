import { InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Command, CommandRunner, RootCommand } from 'nest-commander';

@RootCommand({
  name: 'bull',
  arguments: '<task>',
  description: 'bull manage root command',
})
export class BullRootCommand extends CommandRunner {
  constructor(@InjectQueue('event') private readonly eventQueue: Queue) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    Logger.log('Bull manage root command', {
      state: !(await this.eventQueue.isPaused()),
    });
  }
}

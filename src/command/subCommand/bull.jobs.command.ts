import { Logger } from '@nestjs/common';
import { CommandRunner, SubCommand } from 'nest-commander';

@SubCommand({
  name: 'job',
  aliases: ['j'],
  description: 'bull job manage command',
})
export class BullJobCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    Logger.log('Job manage command', { passedParams, options });
  }
}

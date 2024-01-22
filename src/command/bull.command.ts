import { Logger } from '@nestjs/common';
import { Command, CommandRunner, RootCommand } from 'nest-commander';

@RootCommand({
  name: 'bull',
  arguments: '<task>',
  description: 'bull manage root command',
})
export class BullRootCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    Logger.log('Bull manage root command', { passedParams, options });
  }
}

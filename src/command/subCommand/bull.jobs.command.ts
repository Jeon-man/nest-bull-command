import { InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { CommandRunner, Option, SubCommand } from 'nest-commander';

@SubCommand({
  name: 'job',
  aliases: ['j'],
  description: 'bull job manage command',
})
export class BullJobCommand extends CommandRunner {
  constructor(@InjectQueue('event') private readonly eventQueue: Queue) {
    super();
  }

  async run(
    passedParams: string[],
    options: Record<string, any>,
  ): Promise<void> {
    Logger.log('job manage command', { passedParams, options });

    if (options.all) {
      const jobs = await this.eventQueue.getJobs();

      const result = await Promise.all(
        jobs.map(
          async (job) =>
            `job: ${job.id}, name: ${
              job.name
            }, status: ${await job.getState()}`,
        ),
      );

      Logger.log('\n' + result.join('\n'));
      return;
    }
  }

  @Option({
    name: 'all',
    flags: '-a, --all',
    description: 'Show all jobs',
  })
  parseAll() {
    return true;
  }
}

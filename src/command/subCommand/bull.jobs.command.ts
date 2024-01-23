import { InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
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

  private async makeJobResponse(jobs: Job<any, any, string>[]) {
    const result = await Promise.all(
      jobs.map(
        async (job) =>
          `job: ${job.id}, name: ${job.name}, status: ${await job.getState()}`,
      ),
    );

    Logger.log('\n' + result.join('\n'));
  }

  async run(
    passedParams: string[],
    options: Record<string, any>,
  ): Promise<void> {
    Logger.log('job manage command', { passedParams, options });

    if (Object.keys(options).length > 1) {
      Logger.error('You must use only one option.');
      return;
    }

    for (const key in options) {
      switch (key) {
        case 'all':
          const jobs = await this.eventQueue.getJobs();
          Logger.log('Show all bull jobs');
          await this.makeJobResponse(jobs);
          break;
        default:
          console.log('Unknown command');
      }
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

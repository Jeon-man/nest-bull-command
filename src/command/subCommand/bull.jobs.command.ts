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
    if (jobs.length === 0) {
      Logger.log('Not Found Jobs');
      return;
    }

    function formatText(input: string, maxLineLength: number): string {
      const words = input.split(' ');
      let lineLength = 0;
      let result = '';

      for (const word of words) {
        if (lineLength + word.length > maxLineLength) {
          result += '\n';
          lineLength = 0;
        }

        result += word + ' ';
        lineLength += word.length + 1;
      }

      return result;
    }

    const result = await Promise.all(
      jobs.map(
        async (job) =>
          `--------------------------------------------------\njob id: ${
            job.id
          } (${await job.getState()})
${
  job.failedReason
    ? `\n - reason: ${formatText(
        job.failedReason,
        50,
      )}\n - stacktrace: ${formatText(job.stacktrace[0], 50)} `
    : ``
}
--------------------------------------------------\n**************************************************`,
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
          await this.makeJobResponse(jobs.sort());
          break;
        case 'failed':
          const failedJobs = await this.eventQueue.getFailed();
          Logger.log('Show all failed job');
          await this.makeJobResponse(failedJobs);
          break;
        case 'retry':
          const job = await this.eventQueue.getJob(options[key]);
          if (!job) {
            Logger.error('Not Found Job');
            break;
          }
          if ((await job.getState()) !== 'failed') {
            Logger.error('You must retry only failed jobs');
            break;
          }
          await job.retry();
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

  @Option({
    name: 'failed',
    flags: '-f, --failed',
    description: 'Show all failed jobs',
  })
  parseFailed() {
    return true;
  }

  @Option({
    name: 'retry',
    flags: '-r, --retry <jobId>',
    description: 'Retry on fail job',
  })
  parseJobId(jobId: string) {
    return jobId;
  }
}

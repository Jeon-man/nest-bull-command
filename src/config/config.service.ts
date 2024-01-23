import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  QUEUE_REDIS_HOST: string;

  @IsNumber()
  QUEUE_REDIS_PORT: number;

  @IsString()
  QUEUE_PREFIX: string;
}

export const validateConfig = (env: Record<string, any>) => {
  const envInstance = plainToInstance(EnvironmentVariables, env, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
    exposeUnsetFields: true,
  });

  validateSync(envInstance, {
    enableDebugMessages: true,
  });

  return envInstance;
};

import { ConfigService as ConfigServiceOriginal } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/config.service';

declare global {
  export namespace NodeJS {
    interface ProcessEnv extends EnvironmentVariables {}
  }
}

module '@nestjs/config' {
  export class ConfigService<
    K extends EnvironmentVariables = EnvironmentVariables,
    WasValidated extends boolean = false,
  > extends ConfigServiceOriginal<K, WasValidated> {
    get<P extends keyof K>(propertyPath: P): K[P];
    getOrThrow<P extends keyof K>(propertyPath: P): K[P];
  }

  export * from '@nestjs/config';
}

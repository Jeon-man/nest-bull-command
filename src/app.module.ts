import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullCommandModule } from './command/bull.command.module';

@Module({
  imports: [BullCommandModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

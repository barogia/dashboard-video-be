import { Module } from '@nestjs/common';
import { WarningService } from './warning.service';
import { WarningController } from './warning.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warning } from './entity/warning.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Warning]), ConfigModule],
  controllers: [WarningController],
  providers: [WarningService],
})
export class WarningModule {}

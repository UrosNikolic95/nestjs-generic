import { Module } from '@nestjs/common';
import { GenericService } from './generic.service';

@Module({
  providers: [GenericService],
  exports: [GenericService],
})
export class GenericModule {}

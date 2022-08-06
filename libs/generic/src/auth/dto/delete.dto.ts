import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteDto {
  @ApiProperty()
  @IsString()
  password: string;
}

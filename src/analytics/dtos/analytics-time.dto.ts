import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AnalyticsTimeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  method: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  path: string;
}

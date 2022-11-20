import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetPasswordDto {
  @ApiProperty()
  @IsString()
  newPassword: string;
}

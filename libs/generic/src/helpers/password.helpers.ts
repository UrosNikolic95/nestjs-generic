import { UnprocessableEntityException } from '@nestjs/common';

export function checkRequirements(pass: string) {
  if (!pass.match(/[A-Z]/))
    throw new UnprocessableEntityException(
      'Password has to have at least one uppercase letter.',
    );
  if (!pass.match(/[a-z]/))
    throw new UnprocessableEntityException(
      'Password has to have at least one lover case letter.',
    );
  if (!pass.match(/[0-9]/))
    throw new UnprocessableEntityException(
      'Password has to have at least one number.',
    );
  if (!pass.match(/[!@><?:;"|{}/*-+=|"'.,]/))
    throw new UnprocessableEntityException(
      'Password has to have at least one symbol out of !@><?:;"|{}/*-+=|"\'.,.',
    );
}

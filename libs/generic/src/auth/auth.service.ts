import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { DeleteDto } from './dto/delete.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  register(body: RegisterDto) {
    return this.userRepo.save(body);
  }

  async login(req: Request, body: LoginDto) {
    const found = await this.userRepo.findOne({ where: { email: body.email } });
    if (!found)
      throw new UnprocessableEntityException('No user by that email.');
    if (await compare(found.password, body.password)) {
      req.session['payload'] = found.email;
      return found;
    } else {
      throw new UnprocessableEntityException('Wrong password.');
    }
  }

  async delete(req: Request, body: DeleteDto) {
    if (await compare(req.user['password'], body.password)) {
      const user = req.user as UserEntity;
      await user.softRemove();
      return req.user;
    }
    throw new UnauthorizedException('Wrong password.');
  }
}

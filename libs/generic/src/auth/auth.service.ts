import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { Request } from 'express';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserSubscriber } from '../subscribers/user.subscriber';
import { DeleteDto } from './dto/delete.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  validate(email: string) {
    return this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  register(body: RegisterDto) {
    return this.userRepo.save(body);
  }

  async login(body: LoginDto) {
    const found = await this.userRepo.findOne({ where: { email: body.email } });
    if (!found) throw new UnauthorizedException('No user by that email.');
    if (await compare(body.password, found.password)) {
      return found;
    } else {
      throw new UnauthorizedException('Wrong password.');
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

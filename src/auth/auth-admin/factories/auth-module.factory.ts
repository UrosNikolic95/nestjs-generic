import { Module } from '@nestjs/common';
import { IGenerateModule } from '../interfaces/generate-module.interface';
import { PhoneModule } from '../../../phone/phone.module';
import { MailModule } from '../../../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfig } from '../../../config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export function authModuleFactory(data: IGenerateModule) {
  @Module({
    imports: [
      data?.databaseName
        ? TypeOrmModule.forRoot({
            type: 'postgres',
            name: data?.databaseName,
            url: data?.databaseUrl,
            autoLoadEntities: true,
            synchronize: true,
            namingStrategy: new SnakeNamingStrategy(),
          })
        : null,
      TypeOrmModule.forFeature(
        [data.UserEntity, data.DeviceEntity, data.InvitationEntity],
        data?.databaseName,
      ),
      PassportModule.register({ session: true }),
      JwtModule.register({
        secret: envConfig.JWT_SECRET,
        signOptions: { expiresIn: envConfig.JWT_EXPIRES },
      }),
      MailModule,
      PhoneModule,
    ].filter((el) => el),
    controllers: [data.AuthController],
    providers: [
      data.AuthService,
      data.LocalStrategy,
      data.LocalGuard,
      data.JwtGuard,
      data.JwtStrategy,
      data.AdminSubscriber,
    ],
  })
  class AuthModule {}

  data.AuthModule = AuthModule;
}

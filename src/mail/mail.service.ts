import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { envConfig } from '../config';

@Injectable()
export class MailService {
  transport: Transporter<SentMessageInfo>;

  constructor() {
    this.transport = createTransport({
      host: envConfig.SMTP_HOST,
      port: Number(envConfig.SMTP_PORT),
      auth: {
        user: envConfig.SMTP_USER,
        pass: envConfig.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    return await this.transport.sendMail({
      from: envConfig.SMTP_FROM,
      to,
      subject,
      text,
    });
  }
}

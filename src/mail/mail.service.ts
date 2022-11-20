import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  transport: Transporter<SentMessageInfo>;

  constructor() {
    this.transport = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    return await this.transport.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
    });
  }
}

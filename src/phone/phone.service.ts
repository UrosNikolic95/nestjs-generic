import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { envConfig } from '../config';
import { Twilio } from 'twilio';

@Injectable()
export class PhoneService {
  twilio: Twilio;
  constructor() {
    this.twilio = twilio(
      envConfig.TWILIO_ACCOUNT_SID,
      envConfig.TWILIO_AUTH_TOKEN,
    );
  }

  send({ phone, message }: { phone: string; message: string }) {
    return this.twilio.messages.create({
      from: envConfig.TWILIO_PHONE_NUMBER,
      to: phone,
      body: message,
    });
  }
}

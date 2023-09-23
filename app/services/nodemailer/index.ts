import { GMAIL_EMAIL, GMAIL_PASSWORD, NODE_ENV } from '@aa/config';
import nodemailer from 'nodemailer';

import { Logger } from '../logger';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: NODE_ENV === 'production' ? 465 : 587,
  secure: NODE_ENV === 'production',
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_PASSWORD,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const res = await transporter.sendMail({
      from: 'AI Portrait Studio',
      to,
      subject,
      html,
    });

    if (!res.accepted) {
      throw new Error('Email not sent');
    }

    return res;
  } catch (err) {
    Logger.log('error', err);

    return err instanceof Error ? err : new Error("Couldn't send email");
  }
}

import { Logger } from '@aa/services/logger';

import prisma from './prisma';

export async function getUser(email: string) {
  try {
    const result = await prisma.user.findUnique({
      where: { email },
    });

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function createUser(email: string) {
  try {
    const result = await prisma.user.create({
      data: { email },
    });

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function reduceUserCredits(email: string, credits: number) {
  try {
    const result = await prisma.user.update({
      where: { email },
      data: { credits: { decrement: credits } },
    });

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

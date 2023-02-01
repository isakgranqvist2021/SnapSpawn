import { Logger } from '@aa/services/logger';

import prisma from './prisma';

export async function getAvatars(email: string) {
  try {
    const result = await prisma.avatar.findMany({
      where: { email },
    });

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function createAvatar(email: string, avatar: string) {
  try {
    const result = await prisma.avatar.create({
      data: { email, avatar },
    });

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function createAvatars(email: string, avatars: string[]) {
  try {
    const result = prisma.avatar.createMany({
      data: avatars.map((avatar) => ({
        avatar,
        email,
      })),
    });

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

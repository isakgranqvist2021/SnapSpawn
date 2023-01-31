import prisma from './prisma';

export function getAvatars(email: string) {
  return prisma.avatar.findMany({
    where: { email },
  });
}

export function createAvatar(email: string, avatar: string) {
  return prisma.avatar.create({
    data: { email, avatar },
  });
}

export function createAvatars(email: string, avatars: string[]) {
  return prisma.avatar.createMany({
    data: avatars.map((avatar) => ({
      avatar,
      email,
    })),
  });
}

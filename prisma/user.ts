import prisma from './prisma';

export function getUser(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export function createUser(email: string) {
  return prisma.user.create({
    data: { email },
  });
}

export function updateUserCredits(email: string, credits: number) {
  return prisma.user.update({
    where: { email },
    data: { credits: { increment: credits } },
  });
}

export function reduceUserCredits(email: string, credits: number) {
  return prisma.user.update({
    where: { email },
    data: { credits: { decrement: credits } },
  });
}

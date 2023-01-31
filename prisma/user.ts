import prisma from './prisma';

export const getUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};

export const createUser = async (email: string) => {
  const user = await prisma.user.create({
    data: { email },
  });

  return user;
};

export const updateUserCredits = async (email: string, credits: number) => {
  const user = await prisma.user.update({
    where: { email },
    data: {
      credits: { increment: credits },
    },
  });
  return user;
};

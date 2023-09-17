import { paginateAvatars } from '@aa/database/avatar';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

async function handlePaginateAvatars(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const session = await getSession(req, res);
    if (!session?.user.email) {
      throw new Error('No email');
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const paginateResult = await paginateAvatars({
      email: session.user.email,
      page,
      limit: Math.min(limit, 100),
    });

    res.status(200).json(paginateResult);
  } catch {
    res.status(500).json({
      data: null,
      totalCount: 0,
      pageCount: 0,
      currentPage: 0,
      pageSize: 0,
    });
  }
}

export default withApiAuthRequired(handlePaginateAvatars);

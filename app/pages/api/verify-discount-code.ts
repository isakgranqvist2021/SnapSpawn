import { discounts } from '@aa/database/discount';
import { Logger } from '@aa/services/logger';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

async function verifyDiscountCode(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    req.body = JSON.parse(req.body);

    if (!req.body.discountCode) {
      return res.status(400).json({ error: 'Missing discount code' });
    }

    const discount = discounts.find((discount) => {
      return discount.code === req.body.discountCode;
    });
    if (!discount) {
      res.status(404).json({ error: 'Discount code not found' });
      return;
    }

    return res.status(200).json({
      discount,
    });
  } catch (err) {
    Logger.log('error', err);
    return res.status(500).send({
      referral: null,
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

export default withApiAuthRequired(verifyDiscountCode);

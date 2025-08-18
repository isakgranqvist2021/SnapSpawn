import { GetServerSidePropsContext } from 'next';

type CampaignData = {
  firstPurchaseDiscount: number;
  startDate: number;
  endDate: number;
};

const campaign: Record<string, CampaignData> = {
  'first-purchase-discount': {
    firstPurchaseDiscount: 0.1,
    startDate: new Date('2025-08-01').getTime(),
    endDate: new Date('2025-08-31').getTime(),
  },
};

interface OfferProps {
  campaignData: CampaignData | null;
}

export default function Offer(props: OfferProps) {
  if (!props.campaignData) {
    return <p>No campaign data available</p>;
  }

  return <p>Offer</p>;
}

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext,
): Promise<{ props: OfferProps }> => {
  const { id } = ctx.params || {};

  if (typeof id !== 'string') {
    return {
      props: {
        campaignData: null,
      },
    };
  }

  const campaignData = campaign[id];
  if (!campaignData) {
    return {
      props: {
        campaignData: null,
      },
    };
  }

  return { props: { campaignData } };
};

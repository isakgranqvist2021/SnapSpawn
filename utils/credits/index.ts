export function creditsToStripeAmount(credits: number) {
  if (credits === 10) {
    return 100;
  }

  if (credits === 50) {
    return 450;
  }

  return 800;
}

export function stripeAmountToCredits(stripeAmount: number) {
  if (stripeAmount === 100) {
    return 10;
  }

  if (stripeAmount === 450) {
    return 50;
  }

  return 100;
}

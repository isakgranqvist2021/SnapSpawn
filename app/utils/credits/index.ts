export function creditsToStripeAmount(credits: number) {
  if (credits === 10) {
    return 100;
  }

  if (credits === 50) {
    return 450;
  }

  return 800;
}

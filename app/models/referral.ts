export interface ReferralModel {
  createdAt: number;
  creditsEarned: number;
  email: string;
  id: string;
  status: 'pending' | 'success' | 'failure';
}

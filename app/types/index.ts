import { AvatarModel } from '@aa/models';

export interface AccountProps {
  avatars: AvatarModel[];
  credits: number;
}

export interface GetServerSideProps {
  props: AccountProps;
}

export type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

export interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
}

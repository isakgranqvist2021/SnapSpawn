import { AvatarModel } from '@aa/models';
import { IncomingMessage, ServerResponse } from 'http';

export interface AccountProps {
  avatars: AvatarModel[];
  credits: number;
}

export interface GetServerSideProps {
  props: AccountProps;
}

export interface GetServerSidePropsContext {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
}

export type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

export interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
}

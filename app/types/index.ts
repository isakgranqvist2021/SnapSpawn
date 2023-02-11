export type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

export interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
}

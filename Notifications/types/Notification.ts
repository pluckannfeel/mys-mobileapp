export interface Notification {
  id: string;
  code: string;
  created_at: Date;
  params?: {
    quantity?: string;
    user?: string;
    staff?: string | {};
    date?: Date;
    subject?: string;
    mys_id?: string;
    status?: string;
  };
  unread: boolean;
}

export interface DeviceToken {
  id?: string;
  token: string;
  staff_code: string;
  created_at?: Date;
}

export interface NotificationParams {
  type: string;
  screen: string;
  params: { [key: string]: any }; // Adjust according to the actual structure
}
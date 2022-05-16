export interface Notifications {
  _id: string;
  username?: string;
  teamcode?: string;
  method: string;
  type: string;
  sentdate: Date;
  acknowledgeddate?: Date;
  sender: string;
  header: string;
  message: string;
  link?: string;
  importance: string;
  archive: boolean;
}

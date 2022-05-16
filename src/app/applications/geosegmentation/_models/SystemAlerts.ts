export interface SystemAlerts {
  _id: string;
  name: string;
  message: string;
  startdate: Date;
  enddate: Date;
  status: string;
  icon: string;
  author?: string;
  archive: boolean;
}

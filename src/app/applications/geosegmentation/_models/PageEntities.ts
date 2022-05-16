import { DTOCategories } from "./DTOCategories";

export class DTOPage {
  id: number;
  name: string;
  description: string;
  category?: DTOCategories;
  layout: DTOLayout;
  isHomePage: boolean;
  uatOnly?: boolean;
  path?: string;
  dateCreated: Date;
  roles?: string;
  deleteFlag: boolean;
}

export class DTOLayout {
  id: number;
  name: string;
  sections?: DTOSections[];
  deleteFlag: boolean;
}

export class DTOSections {
  id: number;
  columns?: DTOColumns[];
  deleteFlag: boolean;
}

export class DTOColumns {
  id: number;
  colspan: number;
  components?: DTOComponents[];
  deleteFlag: boolean;
}

export class DTOComponents {
  id: number;
  name: string;
  type: string;
  componentID?: number;
  onNavBar?: boolean;
  includeInPrint: boolean;
  internalComponents?: DTOComponents[];
  deleteFlag: boolean;
  orderNumber: number;
}

export class DTOCategories {
  id: number;
  name: string;
  dateAdded: Date;
  deleteFlag: Boolean;
  parent?: DTOCategories;
}

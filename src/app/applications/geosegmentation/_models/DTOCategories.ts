export class DTOCategories {
    id: number;
    name: string;
    dateAdded: Date;
    deleteFlag: boolean;
    parent?: DTOCategories;
}

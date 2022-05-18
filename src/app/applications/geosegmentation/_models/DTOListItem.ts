export class DTOListItem {
    id: number;
    option: string;
    ordernumber: number;
    parentid: number;
}

export class DTOQuestionList {
    entityGlobalListId: number;
    entityListId: number;
    list: DTOListItem;
}

export class DTOGlobalList {
    id: number;
    name: string;
    description: string;
    deleteflag?: boolean;
    questionList?: DTOQuestionList[];
}

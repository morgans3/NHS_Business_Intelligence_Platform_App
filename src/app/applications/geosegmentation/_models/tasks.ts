export interface Tasks {
    _id: string;
    username?: string;
    teamcode?: string;
    iscompleted: boolean;
    completedby?: string;
    enddate?: Date;
    sentdate: Date;
    acknowledgeddate?: Date;
    sender: string;
    header: string;
    message: string;
    link?: string;
    importance: string;
    archive: boolean;
    invite?: string;
    app_id?: string;
}

export interface Events {
    start: Date;
    end: Date;
    title: string;
    color_primary: string;
    color_secondary: string;
    resizable_before?: boolean;
    resizable_after?: boolean;
    link?: string;
    importance: string;
    archive: boolean;
}

export interface TeamEvent extends Events {
    teamcode: string;
    author: string;
}

export interface Application {
    name: string;
    url: string;
    ownerName: string;
    ownerEmail: string;
    isArchived?: boolean;
    icon: string;
    environment: string;
    status: string;
}

export interface Installation {
    _id?: string;
    username?: string;
    teamcode?: string;
    app_name: string;
    isArchived: boolean;
    requestdate: Date;
    requestor: string;
    requestapprover?: string;
    approveddate?: Date;
    refusedate?: Date;
    linemanager?: string;
    linemanagerapproval?: Date;
}

export interface NewsFeed {
    destination: string;
    type: string;
    priority: string;
    isArchived: boolean;
}

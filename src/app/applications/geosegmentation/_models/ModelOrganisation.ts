export interface Organisation {
    _id: string;
    name: string;
    authmethod: string;
    code?: string;
    contact?: string;
}

export interface OrganisationMembers {
    _id: string;
    organisationcode: string;
    username: string;
    rolecode?: string;
    joindate: Date;
    enddate?: Date;
    isArchived: boolean;
}

export interface Team {
    _id: string;
    name: string;
    description: string;
    code: string;
    organisationcode: string;
    responsiblepeople: any[];
}

export interface TeamMembers {
    _id: string;
    teamcode: string;
    username: string;
    rolecode?: string;
    joindate: Date;
    enddate?: Date;
    isArchived: boolean;
}

export interface TeamRequest {
    _id?: string;
    username: string;
    teamcode: string;
    isArchived: boolean;
    requestdate: Date;
    requestor?: string;
    requestapprover?: string;
    approveddate?: Date;
    refusedate?: Date;
    __v?: number;
}

export interface Roles {
    _id: string;
    code: string;
    name: string;
    description: string;
    organisationcode: string;
    permissioncodes: string[];
    responsiblepeople: string[];
}

export interface Network {
    _id: string;
    name: string;
    description: string;
    code: string;
    archive: boolean;
    responsiblepeople: any[];
    teams?: Team[];
}

export interface NetworkMembers {
    _id: string;
    networkcode: string;
    teamcode: string;
    joindate: Date;
    enddate?: Date;
    isArchived: boolean;
}

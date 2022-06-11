export interface Organisation {
    id: string;
    name: string;
    authmethod: string;
    code?: string;
    contact?: string;
}

export interface OrganisationMembers {
    id: string;
    organisationcode: string;
    username: string;
    rolecode?: string;
    joindate: Date;
    enddate?: Date;
    isArchived: boolean;
}

export interface Team {
    id: string;
    name: string;
    description: string;
    code: string;
    organisationcode: string;
    responsiblepeople: any[];
}

export interface TeamMembers {
    id: string;
    teamcode: string;
    username: string;
    rolecode?: string;
    joindate: Date;
    enddate?: Date;
    isArchived: boolean;
}

export interface TeamRequest {
    id?: string;
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
    id: string;
    code: string;
    name: string;
    description: string;
    organisationcode: string;
    permissioncodes: string[];
    responsiblepeople: string[];
}

export interface Network {
    id: string;
    name: string;
    description: string;
    code: string;
    archive: boolean;
    responsiblepeople: any[];
    teams?: Team[];
}

export interface NetworkMembers {
    id: string;
    networkcode: string;
    teamcode: string;
    joindate: Date;
    enddate?: Date;
    isArchived: boolean;
}

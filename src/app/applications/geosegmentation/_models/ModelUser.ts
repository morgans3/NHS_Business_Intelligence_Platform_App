export class ModelUser {
    success: boolean;
    token?: string;
}

export class Credentials {
    username: string;
    password: string;
    organisation: string;
    authentication: string;
}

export class UserProfile {
    _id: string;
    name: string;
    username: string;
    email: string;
    organisation: string;
}

export class UserDetails {
    _id: string;
    username: string;
    photobase64?: string;
    contactnumber?: string;
    preferredcontactmethod?: string;
    mobiledeviceids?: string[];
    emailpreference?: string;
    impreference?: string;
    im_id?: string;
}

export class FullUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    organisation: string;
    photobase64?: string;
    contactnumber?: string;
    preferredcontactmethod?: string;
    mobiledeviceids?: string[];
    emailpreference?: string;
    linemanager?: string;
    impreference?: string;
    im_id?: string;
    lastactive?: Date;
}

export interface Incident {
    index: string;
    ics: string;
    type?: string;
    method?: string;
    bcu?: string;
    coroner_area?: string;
    csp_distict?: string;
    ccg?: string;
    lancs12?: boolean;
    reported_by?: string;
    incident_ref?: string;
    date?: Date;
    postcode?: string;
    type_of_location?: string;
    local_authority?: string;
    residence_location?: Location;
    incident_location?: Location;
    gender?: string;
    date_of_birth?: Date;
    occupation?: string;
    type_of_job?: string;
    employment?: string;
    imd_decile?: string;
    local?: boolean;
    gp_practice?: string;
    gp_name?: string;
    medication?: string[];
    bereavement_offered?: string;
    inquest_conclusion?: string;
    inquest_date?: Date;
    rts_accurate?: string;
    mosType?: string;
    postcode_data?: string;
    location_postcode_data?: string;
    location_postcode_mosaic?: string;
    postcode_mosaic?: string;
}

export interface IncidentMethods {
    dateCreated: Date;
    method: string;
    priority: string;
    list?: string;
}

export interface iLocation {
    postcode?: string;
    eastings?: string;
    northings?: string;
    latitude?: string;
    longitude?: string;
}

export class StatCardData {
    title: string;
    value: string;
    color: string;
    icon: string;
    text?: string;
    subvalue?: string;
    subvaluetext?: string;
}

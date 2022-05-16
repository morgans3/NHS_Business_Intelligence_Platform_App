export interface Crime {
  category: string;
  location_type: string;
  location: CrimeLocation;
  context: string;
  outcome_status: any;
  persistent_id: string;
  id: string;
  location_subtype: string;
  month: string;
}

export interface CrimeLocation {
  latitude: string;
  street: CrimeStreet;
  longitude: string;
}

export interface CrimeStreet {
  id: string;
  name: string;
}

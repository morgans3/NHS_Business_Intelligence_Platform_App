import { FieldConfig } from "./field.interface";

export class EntityForms {
  path: string;
  title: string;
  abbreviation: string;
  claim: string;
  id: string;
  questions: FieldConfig[];
  type: EntityFormTypes;
  complexGetURL: string;
  complexPostURL: string;
  complexPutURL: string;
}

export class EntityFormTypes {
  id: number;
  type: string;
  patientForm: boolean;
  forms: EntityForms[];
}

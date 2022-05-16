import { Validators } from "@angular/forms";
import { DTOQuestionList, DTOGlobalList } from "./DTOListItem";
import { EntityForms } from "./ModelForms";

export interface Validator {
  name: string;
  validator: Validators;
  message: string;
  validatortype: string;
  validatorpattern?: string;
}

export interface FieldConfig {
  label?: string;
  name?: string;
  inputType?: string;
  options?: Options[];
  collections?: any;
  type: string;
  value?: any;
  validators?: Validator[];
  savedDataType?: string;
  rules?: Rules[];
  orderNumber?: number;
  form?: EntityForms;
  globalList?: DTOGlobalList;
}

export interface Options {
  ordernumber?: number;
  option: string;
  id: any;
}

export interface Rules {
  dependOnQuestionID?: number;
  dependOnQuestionName: string;
  trigger: Trigger;
  action: string;
  actionValue: any;
  id: any;
}

export interface Trigger {
  type: string;
  value: any;
}

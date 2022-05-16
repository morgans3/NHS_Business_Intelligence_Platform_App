import { FieldConfig } from "./field.interface";

export class EntityFormAnswers {
  id: number;
  answer: string;
  answerDT?: Date;
  answerNumber?: number;
  answerBool?: boolean;
  question: FieldConfig;
  groupedResponse: EntityGroupedResponse;
}

export class EntityGroupedResponse {
  id: number;
  submittedBy?: string;
  submittedDT?: Date;
  hospitalNumber?: string;
  otherUniqueID?: string;
  answers: EntityFormAnswers[];
}

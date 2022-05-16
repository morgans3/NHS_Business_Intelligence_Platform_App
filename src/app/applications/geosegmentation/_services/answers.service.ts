import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { EntityFormAnswers, EntityGroupedResponse } from "../_models/DTOFormAnswer";
import { BaseService } from "diu-component-library";
declare var window: any;

@Injectable({
  providedIn: "root"
})
export class FormAnswersService extends BaseService {
  baseUrl = "";
  controller = "FormAnswers";

  constructor(protected http: HttpClient, @Inject("environment") environment) {
    super(http, environment);
    const origin = window.location.href;
    this.baseUrl = this.combineURL(origin, "api");
  }

  public get() {
    return this.http.get<EntityFormAnswers[]>(
      this.baseUrl + this.controller + "/"
    );
  }

  public getFormAnswer(id: number) {
    return this.http.get<EntityFormAnswers>(
      this.baseUrl + this.controller + "/" + id
    );
  }

  public getAnswersByGroupedResponseID(id: number) {
    return this.http.get<EntityGroupedResponse>(
      this.baseUrl + this.controller + "getAnswersByGroupedResponseID/" + id
    );
  }

  public setAnswersByGroupedResponseID(payload: EntityGroupedResponse) {
    return this.http.post(
      this.baseUrl + this.controller + "setAnswersByGroupedResponseID/",
      payload
    );
  }

  public getDocumentByGroupedResponse(form: EntityGroupedResponse) {
    return this.http.get(
      this.baseUrl + "PDFGenerator/getDocumentByGroupedResponse/" + form.id,
      {
        responseType: "arraybuffer"
      }
    );
  }
}

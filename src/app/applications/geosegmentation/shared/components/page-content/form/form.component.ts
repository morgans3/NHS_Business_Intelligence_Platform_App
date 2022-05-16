import { Component, OnInit } from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";
import { EntityForms } from "../../../../_models/ModelForms";
import { NotificationService } from "../../../../../../_services/notification.service";
import { EntityFormAnswers, EntityGroupedResponse } from "../../../../_models/DTOFormAnswer";
import { FormsService } from "../../../../_services/forms.service";
import { FormAnswersService } from "../../../../_services/answers.service";

export class ResponseArray {
  name: string;
  val: any;
}

@Component({
  selector: "app-form",
  template: `
    <div *ngIf="selectedForm">
      <dynamic-form [fields]="selectedForm.questions" (submit)="submit($event)"></dynamic-form>
    </div>
    <div *ngIf="!selectedForm">Loading...</div>
  `,
  styles: []
})
export class FormComponent implements OnInit {
  component: DTOComponents;
  selectedForm: EntityForms;
  constructor(
    private formService: FormsService,
    private answerService: FormAnswersService,
    private toastr: NotificationService
  ) {}

  ngOnInit() {
    this.updateForm();
  }

  updateForm() {
    this.formService.getForm(this.component.componentID).subscribe(res => {
      this.selectedForm = res;
      this.selectedForm.questions.push({
        type: "button",
        label: "Save"
      });
    });
  }

  submit(value: any) {
    console.log(value);
    const responseArray: ResponseArray[] = [];
    const valuepair = JSON.stringify(value)
      .replace("{", "")
      .replace("}", "");
    const valuearray = valuepair.split(",");
    valuearray.forEach(elem => {
      const thisName = elem.split(":")[0];
      let thisVal = elem.split(":")[1];
      if (elem.split(":").length > 2) {
        thisVal = elem.substr(thisName.length + 1);
      }
      responseArray.push({
        name: thisName.replace('"', ""),
        val: thisVal.replace('"', "")
      });
    });
    const answerArray: EntityFormAnswers[] = [];

    this.selectedForm.questions.forEach(question => {
      if (question.type !== "button") {
        const thisAnswerValue: ResponseArray = responseArray.find(
          x => x.name.toLowerCase().replace('"', "") === question.name.toLowerCase()
        ).val;
        const filteredAnswer = thisAnswerValue.toString().replace('"', "");
        const newAnswer: EntityFormAnswers = {
          id: 0,
          answer: filteredAnswer,
          question: question,
          groupedResponse: null
        };
        switch (question.savedDataType) {
          case "datetime":
            newAnswer.answerDT = new Date(Date.parse(filteredAnswer));
            break;
          case "boolean":
            newAnswer.answerBool = filteredAnswer.toLowerCase() === "true";
            break;
          case "int":
            newAnswer.answerNumber = parseInt(filteredAnswer);
            break;
          default:
            break;
        }
        answerArray.push(newAnswer);
      }
    });

    const response: EntityGroupedResponse = {
      id: null,
      answers: answerArray
    };

    console.log(answerArray);

    this.answerService.setAnswersByGroupedResponseID(response).subscribe((data: EntityGroupedResponse) => {
      console.log(data);
      this.toastr.success("Form Saved with ID: " + data.id);
      this.updateForm();
    });
  }
}

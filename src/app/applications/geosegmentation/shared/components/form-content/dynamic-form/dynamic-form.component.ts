import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { FieldConfig, Validator } from "../../../../_models/field.interface";
import { EntityGroupedResponse } from "../../../../_models/DTOFormAnswer";
import { ContextService } from "../../../../_services/context.service";

@Component({
  exportAs: "dynamicForm",
  // tslint:disable-next-line:component-selector
  selector: "dynamic-form",
  template: `
    <form class="dynamic-form" [formGroup]="form" (submit)="onSubmit($event)">
      <ng-container
        *ngFor="let field of fields"
        dynamicField
        [field]="field"
        [group]="form"
      >
      </ng-container>
    </form>
  `,
  styles: []
})
export class DynamicFormComponent implements OnInit, OnChanges {

  @Input() fields: FieldConfig[] = [];
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;

  get value() {
    return this.form.value;
  }

  constructor(
    private fb: FormBuilder, 
    private context: ContextService
  ) {}

  ngOnInit() {
    this.form = this.createControl();
  }

  ngOnChanges() {
    this.form = this.createControl();
    if (this.context.SavedForm && this.context.SavedForm.value) {
      this.loadPreviousForm(this.context.SavedForm.value);
    }
  }

  loadPreviousForm(oldform: any) {
    this.fields = this.fields.filter(x => x.type !== "button");
    this.form = this.createControl();
    oldform.answers.forEach(answer => {
      if (answer.answerBool) {
        this.fields.find(x => x.name === answer.question.name).value =
          answer.answerBool;
      } else if (answer.answerDT) {
        this.fields.find(x => x.name === answer.question.name).value =
          answer.answerDT;
      } else if (answer.answerNumber) {
        this.fields.find(x => x.name === answer.question.name).value =
          answer.answerNumber;
      } else {
        this.fields.find(x => x.name === answer.question.name).value =
          answer.answer;
      }
    });
    this.form.updateValueAndValidity();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  createControl() {
    const group = this.fb.group({});
    this.fields.forEach(field => {
      if (field.type === "button") {
        return;
      }
      const control = this.fb.control(
        field.value,
        this.bindValidations(field.validators || [])
      );
      group.addControl(field.name, control);
    });
    return group;
  }

  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        validList.push(valid.validator);
      });
      return Validators.compose(validList);
    }
    return null;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
}

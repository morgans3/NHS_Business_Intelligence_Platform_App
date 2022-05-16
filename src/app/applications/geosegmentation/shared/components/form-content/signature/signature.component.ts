import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef
} from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import {
  FieldConfig,
  Validator
} from "../../../../_models/field.interface";
import { AngularSignaturePad } from "angular-signaturepad/signature-pad";

@Component({
  selector: "app-select",
  template: `
    <br />
    <div
      id="signatureBlock"
      [formGroup]="group"
      style="border: 1px solid grey; max-width:700px; padding:4px; margin-bottom: 5px;"
    >
      <mat-card-title>Sign Here:</mat-card-title>
      <signature-pad
        #signaturePad
        [options]="signaturePadOptions"
        (onEndEvent)="drawComplete()"
      ></signature-pad>
      <input
        type="text"
        [formControlName]="field.name"
        style="width:1px; height:1px; line-height:1px; border: none"
      />
      <br />
      <button
        mat-raised-button
        type="button"
        color="warn"
        (click)="signaturePad.clear()"
        style="width:99%; margin: 2px;"
      >
        Clear
      </button>
    </div>
  `,
  styles: []
})
export class SignatureComponent implements OnInit, AfterViewInit {
  
  @ViewChild(AngularSignaturePad) signaturePad: AngularSignaturePad;

  signaturePadOptions: Object = {
    minWidth: 5,
    canvasWidth: 700,
    canvasHeight: 350
  };
  field: FieldConfig;
  group: FormGroup;

  constructor() {}

  ngOnInit() {
    if (this.field.validators && this.field.validators.length > 0) {
      this.field.validators.forEach(element => {
        this.setValidation(element);
      });
    }
  }

  ngAfterViewInit() {
    const width = document.getElementById("signatureBlock").offsetWidth;
    this.signaturePad.set("canvasWidth", width);
    this.signaturePad.set("canvasHeight", Math.floor(width / 2));
    this.signaturePad.clear();
    if (this.field.value != null) {
      this.signaturePad.fromDataURL(this.field.value);
    }
  }

  drawComplete() {
    this.group.removeControl(this.field.name);
    this.group.addControl(
      this.field.name,
      new FormControl(this.signaturePad.toDataURL(), null)
    );
  }

  setValidation(validator: Validator) {
    switch (validator.validatortype) {
      case "pattern":
        this.group.get(this.field.name).validator = Validators.pattern(
          validator.validatorpattern
        );
        break;
      default:
        this.group.get(this.field.name).validator = Validators.required;
        break;
    }
  }
}

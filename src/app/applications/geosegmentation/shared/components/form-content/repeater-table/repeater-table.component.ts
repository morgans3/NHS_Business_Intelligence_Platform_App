import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { FieldConfig } from "../../../../_models/field.interface";

@Component({
  selector: "app-repeater-table",
  templateUrl: "./repeater-table.component.html",
  styleUrls: ["./repeater-table.component.scss"]
})
export class RepeaterTableComponent implements OnInit {
  @Input() entity: any;
  @Input() fields: FieldConfig[];
  @Input() base?: any;
  @Input() readOnly = false;
  repeaterForm: FormGroup;
  @Output() change = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.fields) {
      this.repeaterForm = this.createControl();
    }

    if (this.base) {
      if (this.entity === undefined) {
        this.entity = [this.base];
        this.entity.pop();
      }
    }
  }

  createControl() {
    const group = this.fb.group({});
    this.fields.forEach(field => {
      if (field.type === "button") {
        return;
      }
      const control = this.fb.control(field.value, this.bindValidations(field));
      group.addControl(field.name, control);
    });
    return group;
  }

  bindValidations(field: FieldConfig) {
    if (field.validators && field.validators.length > 0) {
      const validList = [];
      field.validators.forEach(valid => {
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

  addElement(form: any) {
    this.entity.push(form.value);
    this.repeaterForm.reset();
    this.change.emit();
  }

  removeItem(i: number) {
    this.entity.splice(i, 1);
    this.change.emit();
  }

  decamelize(str, separator) {
    separator = typeof separator === "undefined" ? "_" : separator;

    return this.capital_letter(
      str
        .replace(/([a-z\d])([A-Z])/g, "$1" + separator + "$2")
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + separator + "$2")
        .toLowerCase()
    );
  }

  capital_letter(str) {
    str = str.split(" ");

    for (let i = 0, x = str.length; i < x; i++) {
      str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
  }
}

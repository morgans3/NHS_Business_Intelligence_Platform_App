import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ViewChild,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { NotificationService } from "../../../_services/notification.service";
import { PatientService } from "../../../_services/patient.service";

export interface PatientNote {
  nhsNumber: string;
  createdDT: Date;
  type: string;
  note: string;
}

@Component({
  selector: "app-patientnoteform",
  templateUrl: "./patientnoteform.component.html",
  styleUrls: ["./patientnoteform.component.scss"],
})
export class PatientnoteformComponent implements OnInit, OnChanges {
  @Input() nhsnumber: string;
  setnhsnumber: string;
  @Input() editForm?: PatientNote;
  newEditFormID: PatientNote;
  myForm = new FormGroup({
    type: new FormControl(null, Validators.required),
    note: new FormControl(null, Validators.required),
  });
  @ViewChild(FormGroupDirective)
  formDirective: FormGroupDirective;
  form: any;
  @Output() submitted = new EventEmitter();
  constructor(
    private notificationService: NotificationService,
    private patientService: PatientService
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.nhsnumber) {
      if (this.setnhsnumber !== this.nhsnumber) {
        this.setnhsnumber = this.nhsnumber;
      }
    }
    if (this.editForm) {
      if (this.newEditFormID !== this.editForm) {
        this.newEditFormID = this.editForm;
        this.myForm.patchValue(this.newEditFormID);
      }
    }
  }

  onSubmit() {
    const newNote = {
      nhsNumber: this.setnhsnumber,
      createdDT: new Date(),
      type: this.myForm.value.type,
      note: this.myForm.value.note,
    };
    if (this.newEditFormID) {
      newNote.createdDT = this.editForm.createdDT;
      this.patientService.updatePatientNotes(newNote).subscribe((data: any) => {
        if (data.success) {
          this.notificationService.success("Note updated.");
          this.formDirective.resetForm();
          this.newEditFormID = null;
          this.submitted.emit(newNote);
        } else {
          this.notificationService.warning(
            "Unable to add or update notes at this time. Reason: " + data.msg
          );
        }
      });
    } else {
      this.patientService.addPatientNotes(newNote).subscribe((data: any) => {
        if (data.success) {
          this.notificationService.success("Note added.");
          this.formDirective.resetForm();
          this.submitted.emit(newNote);
        } else {
          this.notificationService.warning(
            "Unable to add or update notes at this time. Reason: " + data.msg
          );
        }
      });
    }
  }

  exitEditMode() {
    this.newEditFormID = null;
    this.formDirective.resetForm();
  }

  clearForm() {
    this.formDirective.resetForm();
  }
}

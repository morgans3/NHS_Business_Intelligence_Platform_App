import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { PatientNote } from "../patientnoteform/patientnoteform.component";
import { PatientService } from "../../../_services/patient.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { NotificationService } from "../../../_services/notification.service";

@Component({
  selector: "app-patientinformation",
  templateUrl: "./patientinformation.component.html",
  styleUrls: ["./patientinformation.component.scss"],
})
export class PatientinformationComponent implements OnChanges {
  @Input() nhsnumber: string;
  setnhsnumber: string;
  changes: any[] = [];
  newEditFormID: PatientNote;
  myForm = new FormGroup({
    type: new FormControl(null, Validators.required),
    note: new FormControl(null, Validators.required),
  });
  @ViewChild(FormGroupDirective)
  formDirective: FormGroupDirective;
  form: any;

  constructor(
    private notificationService: NotificationService,
    private patientService: PatientService
  ) {}

  ngOnChanges() {
    if (this.nhsnumber) {
      if (this.setnhsnumber !== this.nhsnumber) {
        this.setnhsnumber = this.nhsnumber;
        this.getData();
      }
    }
  }

  getData() {
    this.changes = [];
    this.patientService
      .getPatientHistory(this.setnhsnumber)
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          res.forEach((element) => {
            this.changes.push({
              date: new Date(element.etl_run_date),
              type:
                "Patient Info changed, reason: " +
                (element.archive_reason || "updated"),
            });
          });
          this.sortChanges();
        }
      });
    this.patientService
      .getDistrictHistory(this.setnhsnumber)
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          res.forEach((element) => {
            this.changes.push({
              date: new Date(element.archive_date),
              type: "District Info updated",
            });
          });
          this.sortChanges();
        }
      });
    this.patientService
      .getPatientNotes(this.setnhsnumber)
      .subscribe((res: PatientNote[]) => {
        if (res && res.length > 0) {
          res.forEach((element) => {
            this.changes.push({
              date: new Date(element.createdDT),
              type: "Patient Note: " + element.type,
              form: element,
            });
          });
          this.sortChanges();
        }
      });
  }

  sortChanges() {
    this.changes.sort((a, b) => {
      return a - b;
    });
  }

  onSubmit() {
    const newNote = {
      nhsNumber: this.setnhsnumber,
      createdDT: new Date(),
      type: this.myForm.value.type,
      note: this.myForm.value.note,
    };
    if (this.newEditFormID) {
      newNote.createdDT = this.newEditFormID.createdDT;
      this.patientService.updatePatientNotes(newNote).subscribe((data: any) => {
        if (data.success) {
          this.notificationService.success("Note updated.");
          this.formDirective.resetForm();
          this.newEditFormID = null;
          this.getData();
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
          this.changes.push({
            date: new Date(newNote.createdDT),
            type: "Patient Note: " + newNote.type,
            form: newNote,
          });
          this.sortChanges();
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

  formSelected(form) {
    this.newEditFormID = form;
    this.myForm.patchValue(form);
  }
}

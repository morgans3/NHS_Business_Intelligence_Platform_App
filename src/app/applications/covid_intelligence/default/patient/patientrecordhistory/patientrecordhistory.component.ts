import {
  Component,
  OnInit,
  OnChanges,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
import { PatientService } from "../../../_services/patient.service";
import { PatientNote } from "../patientnoteform/patientnoteform.component";

@Component({
  selector: "app-patientrecordhistory",
  templateUrl: "./patientrecordhistory.component.html",
  styleUrls: ["./patientrecordhistory.component.scss"],
})
export class PatientrecordhistoryComponent implements OnChanges {
  @Input() nhsnumber: string;
  @Input() reload: PatientNote;
  @Output() formSelect = new EventEmitter<PatientNote>();
  setnhsnumber: string;
  changes: any[] = [];
  constructor(private patientService: PatientService) {}

  ngOnChanges() {
    if (this.nhsnumber) {
      if (this.setnhsnumber !== this.nhsnumber) {
        this.setnhsnumber = this.nhsnumber;
        this.getData();
      }
    }
    if (
      this.reload &&
      this.changes.filter((x) => x.form === this.reload).length > 0
    ) {
      this.getData();
    }
  }

  getData() {
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

  formSelected(form) {
    this.formSelect.emit(form);
  }
}

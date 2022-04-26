import { Component, OnInit } from "@angular/core";
import { JwtHelper } from "angular2-jwt";
import { Store } from "@ngxs/store";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthState } from "../../_states/auth.state";
import { NotificationService } from "../../_services/notification.service";
import { faNotesMedical, faProcedures } from "@fortawesome/free-solid-svg-icons";
import { PatientService } from "../../_services/patient.service";
import { PatientLinked } from "../../_models/patient";
import { PatientNote } from "./patientnoteform/patientnoteform.component";

@Component({
  selector: "app-patient",
  templateUrl: "./patient.component.html",
  styleUrls: ["./patient.component.scss"],
})
export class PatientComponent implements OnInit {
  Procedures = faProcedures;
  NotesMedical = faNotesMedical;
  dataFetched = false;
  tokenDecoded: any;
  nhsnumber: string;
  inputLng = "-3.015379";
  inputLat = "53.821978";
  person: PatientLinked;

  constructor(private route: ActivatedRoute, public store: Store, private router: Router, private patientService: PatientService, private notificationService: NotificationService) {
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      const jwtHelper = new JwtHelper();
      this.tokenDecoded = jwtHelper.decodeToken(token);
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.nhsnumber = params.get("nhsnumber");
      this.getData();
    });
  }

  getData() {
    this.patientService.getPatientDetail(this.nhsnumber).subscribe(
      (res: PatientLinked) => {
        this.dataFetched = true;
        this.person = res;
      },
      (err) => {
        this.notificationService.warning("Unable to find patient details.");
        this.person = null;
        this.dataFetched = true;
      }
    );
  }

  returnToList() {
    this.router.navigate(["/population-list"]);
  }

  displayNHSNumber(nhsnumber: string) {
    if (nhsnumber.length > 0) {
      const first = nhsnumber.substring(0, 4);
      const second = nhsnumber.substr(4, 3);
      const third = nhsnumber.substr(7, 3);
      return first + " " + second + " " + third;
    }
    return "";
  }

  showDate(thedate) {
    if (thedate) {
      return new Date(thedate).toUTCString();
    } else {
      return null;
    }
  }
}

import { Component, Input, OnChanges } from "@angular/core";
import { APIService } from "diu-component-library";

interface CovidTest {
  AssignedPatientLocation: string;
  FillerOrderNumber: string;
  MessageControlID: string;
  ObservationDateTime: Date;
  ObservationIdentifieridentifierST: string;
  ObservationValue: string;
  SendingFacility: string;
  SpecimenRecievedDateTime: Date;
  hospNo: string;
  index: string;
  nhsNumber: string;
}

@Component({
  selector: "app-covidtests",
  templateUrl: "./covidtests.component.html",
  styleUrls: ["./covidtests.component.scss"],
})
export class CovidtestsComponent implements OnChanges {

  @Input() nhsnumber: string;
  setnhsnumber: string;
  results: CovidTest[];

  constructor(private apiService: APIService) {}

  ngOnChanges() {
    if (this.nhsnumber) {
      if (this.setnhsnumber !== this.nhsnumber) {
        this.setnhsnumber = this.nhsnumber;
        this.getData();
      }
    }
  }

  getData() {
    this.apiService
      .getCOVIDTestsByNHSNumber(this.setnhsnumber)
      .subscribe((res: any) => {
        this.results = res;
      });
  }
}

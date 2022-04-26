import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { MosaicService } from "../../../_services/mosaic.service";
import { CovidTest } from "../../../_models/covid";

@Component({
  selector: "app-covidtests",
  templateUrl: "./covidtests.component.html",
  styleUrls: ["./covidtests.component.scss"],
})
export class CovidtestsComponent implements OnChanges {
  @Input() nhsnumber: string;
  setnhsnumber: string;
  results: CovidTest[];
  constructor(private mosaicService: MosaicService) {}

  ngOnChanges() {
    if (this.nhsnumber) {
      if (this.setnhsnumber !== this.nhsnumber) {
        this.setnhsnumber = this.nhsnumber;
        this.getData();
      }
    }
  }

  getData() {
    this.mosaicService
      .getCOVIDTestsByNHSNumber(this.setnhsnumber)
      .subscribe((res: any) => {
        this.results = res;
      });
  }
}

import { Component, OnInit } from "@angular/core";
import {
  BedData,
  TestData,
  MortalityData,
  EquipmentData
} from "../../_models/Regional";
import { InpatientsGpsummary } from "../../_models/GPInpatient";
import { InterfaceService } from "../../_services/interface.service";

const TRUSTS = [
  "Blackpool Teaching Hospitals",
  "Lancashire Teaching Hospitals",
  "Others ..."
];

@Component({
  selector: "app-Local",
  templateUrl: "./Local.component.html",
  styleUrls: ["./Local.component.scss"]
})
export class LocalComponent {
  bedColumns: string[] = [
    "name",
    "overall",
    "occupied",
    "critical",
    "respiratory"
  ];
  bedSource: BedData[] = [];
  testColumns: string[] = ["name", "positive", "negative", "awaiting"];
  testSource: TestData[] = [];
  mortalityColumns: string[] = ["name", "confirmed", "suspected", "rate"];
  mortalitySource: MortalityData[] = [];
  equipmentColumns: string[] = ["name", "total", "inuse", "instock"];
  equipmentSource: EquipmentData[] = [];
  bthToken: string;
  bthInpatients: InpatientsGpsummary[];
  bedsChecked = false;

  constructor(private interfaceService: InterfaceService) {
    TRUSTS.forEach(trust => {
      this.bedSource.push({
        name: trust,
        occupied: "-",
        overall: "-",
        critical: "-",
        respiratory: "-"
      });
      this.testSource.push({
        name: trust,
        positive: "-",
        negative: "-",
        awaiting: "-"
      });
      this.mortalitySource.push({
        name: trust,
        confirmed: "-",
        suspected: "-",
        rate: "-"
      });
      this.equipmentSource.push({
        name: trust,
        total: "-",
        inuse: "-",
        instock: "-"
      });
    });
    // this.getBTHData();
    this.bedsChecked = true;
  }

  getBTHData() {
    this.interfaceService
      .authenticate()
      .subscribe((response: { success: boolean; msg: any }) => {
        if (response.success) {
          this.bthToken = response.msg.token;
          this.interfaceService
            .inpatientGPSummary(this.bthToken)
            .subscribe((res: { success: boolean; msg: any }) => {
              if (res.success && res.msg.length > 0) {
                this.bthInpatients = JSON.parse(res.msg);
                let bthBeds = this.bedSource.find(
                  x => x.name === "Blackpool Teaching Hospitals"
                );
                if (bthBeds) {
                  const percent = Math.floor(
                    (this.bthInpatients.length / 750) * 100
                  );
                  const respiratoryCount = this.bthInpatients.filter(
                    x => x.specialty.toLowerCase().indexOf("respiratory") > -1
                  ).length;
                  bthBeds = {
                    name: bthBeds.name,
                    occupied:
                      this.bthInpatients.length.toString() +
                      " / " +
                      percent +
                      "%",
                    overall: "est. 750",
                    critical: "-",
                    respiratory: respiratoryCount + " / ?"
                  };
                  this.bedSource.splice(
                    this.bedSource.findIndex(
                      x => x.name === "Blackpool Teaching Hospitals"
                    ),
                    1,
                    bthBeds
                  );
                }
              }
              this.bedsChecked = true;
            });
        }
      });
  }
}

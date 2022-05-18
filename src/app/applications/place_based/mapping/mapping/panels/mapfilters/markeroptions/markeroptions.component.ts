import { HttpClient } from "@angular/common/http";
import { Component, Input, OnChanges } from "@angular/core";
import { iMarkerData } from "../mapfilters.component";
import * as L from "leaflet";

@Component({
    selector: "app-markeroptions",
    templateUrl: "./markeroptions.component.html",
    styleUrls: ["./markeroptions.component.css"],
})
export class MarkeroptionsComponent implements OnChanges {
    @Input() data: iMarkerData[] = [];
    @Input() mapreference: any;
    tableData: iMarkerData[] = [];
    showIsoChrone: iMarkerData;
    travelTime: number = 10;
    isoserverUrl = "https://isochrone.nexusintelligencenw.nhs.uk/otp/routers/lsc/isochrone?";

    constructor(private http: HttpClient) {}

    ngOnChanges() {
        this.tableData = this.data;
        console.log(this.tableData);
    }

    selectInfo(data: string) {
        if (data.includes("h4")) {
            let output = data.toString().split("h4>")[1].toString().split("</")[0];
            return output;
        } else {
            return data;
        }
    }

    markerSelected(data: iMarkerData) {
        let carryOutFunction = data.selected;
        this.showIsoChrone = null;
        this.tableData.forEach((marker) => {
            if (marker.selected) {
                marker.selected = false;
            }
        });
        if (carryOutFunction) {
            data.selected = true;
            this.showIsoChrone = data;
        }
    }

    getIsochrone() {
        const paramString = `fromPlace=${this.showIsoChrone.lat},${
            this.showIsoChrone.lng
        }&date=2022/04/28&time=12:00:00&mode=WALK&cutoffSec=${this.travelTime * 60}`;
        this.http.get(this.isoserverUrl + paramString).subscribe((res: any) => {
            console.log(res);
            if (this.mapreference) {
                const geojson = L.geoJSON(res).addTo(this.mapreference);
                // TODO: store geojson for later reference
            }
        });
    }
}

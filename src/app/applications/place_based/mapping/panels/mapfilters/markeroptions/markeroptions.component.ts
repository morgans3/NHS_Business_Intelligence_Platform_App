import { HttpClient } from "@angular/common/http";
import { Component, Input, OnChanges } from "@angular/core";
import { iMarkerData } from "../mapfilters.component";
import * as L from "leaflet";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-markeroptions",
    templateUrl: "./markeroptions.component.html",
})
export class MarkeroptionsComponent implements OnChanges {
    @Input() data: iMarkerData[] = [];
    @Input() mapreference: any;
    tableData: iMarkerData[] = [];
    showIsoChrone: iMarkerData;
    travelTime = 10;
    isoserverUrl = "https://isochrone." + environment.websiteURL + "/otp/routers/lsc/isochrone?";

    constructor(private http: HttpClient) {}

    ngOnChanges() {
        this.tableData = this.data;
    }

    selectInfo(data: string) {
        if (data.includes("h4")) {
            const output = data.toString().split("h4>")[1].toString().split("</")[0];
            return output;
        } else {
            return data;
        }
    }

    markerSelected(data: iMarkerData) {
        const carryOutFunction = data.selected;
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
                L.geoJSON(res).addTo(this.mapreference);
                // TODO: store geojson for later reference
            }
        });
    }
}

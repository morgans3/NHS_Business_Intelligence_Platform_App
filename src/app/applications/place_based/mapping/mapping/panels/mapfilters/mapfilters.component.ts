import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Moment } from "moment-timezone";

export interface iMarkerData {
    icon: string;
    lat: number;
    lng: number;
    visible: boolean;
    data: any;
    selected?: boolean;
}

@Component({
    selector: "app-mapfilters",
    templateUrl: "./mapfilters.component.html",
    styleUrls: ["./mapfilters.component.css"],
})
export class MapfiltersComponent implements OnInit, OnChanges {
    @Input() mapreference: any;
    @Input() mapLayers: any[];
    range = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
    filtertext: string;
    filterrange: { start?: any; end?: any } = {};
    @Output() updateFilter = new EventEmitter();
    markerList: any[] = [];
    markerData: iMarkerData[] = [];

    constructor() {}

    ngOnChanges() {
        if (this.mapLayers) {
            this.checkLayers();
        }
    }

    ngOnInit() {
        this.range.valueChanges.subscribe(() => {
            let start = this.range.controls.start.value;
            if (start) start = <Moment>this.range.controls.start.value.toISOString();
            let end = this.range.controls.end.value;
            if (end) end = <Moment>this.range.controls.end.value.toISOString();
            this.filterrange = { start: start, end: end };
            this.updateFilter.emit({ type: "range", value: this.filterrange });
        });
    }

    applyFilter(value: string) {
        this.filtertext = value;
        this.updateFilter.emit({ type: "text", value: this.filtertext });
        this.filterMarkers(this.markerList);
        this.setMarkerData();
    }

    checkLayers() {
        this.markerList = [];
        this.mapLayers.forEach((layergroup) => {
            if (layergroup && typeof layergroup === "object") {
                const groupLayers: any[] = layergroup.getLayers();
                groupLayers.forEach((layer: any) => {
                    if (layer && layer.options && layer.options.icon) {
                        this.markerList.push(layer);
                    }
                });
            }
        });
        if (this.markerList.length > 0) this.setMarkerData();
        else this.markerData = [];
    }

    setMarkerData() {
        // TODO - change to not overwrite all selections + optionsData
        this.markerData = [];
        this.markerList.forEach((marker) => {
            const icon = marker.options.icon.options.iconUrl;
            const lat = marker.getLatLng().lat;
            const lng = marker.getLatLng().lng;
            const visible = this.checkPopup(marker);
            const data = marker.getPopup().getContent();
            this.markerData.push({ icon, lat, lng, visible, data });
        });
    }

    filterMarkers(markers: any[]) {
        if (markers.length > 0) {
            markers.forEach((marker) => {
                if (this.checkPopup(marker)) {
                    marker.setOpacity(1);
                } else {
                    marker.setOpacity(0);
                }
            });
        }
    }

    checkPopup(marker: any) {
        if (this.filtertext === undefined || this.filtertext === "") return true;
        if (marker.getPopup()) {
            const popup = marker.getPopup().getContent();
            let response = false;
            popup.includes(this.filtertext) ? (response = true) : false;
            return response;
        } else {
            return false;
        }
    }
}

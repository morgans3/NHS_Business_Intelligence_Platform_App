import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { NotificationService } from "../../../../_services/notification.service";
import { tilelayerOptions } from "../../_archived/mapping/tilelayeroptions";
import * as L from "leaflet";
import { PostcodeService } from "../../../../_services/postcodes.service";

@Component({
    selector: "app-pbi-settings",
    templateUrl: "./settings.component.html",
})
export class SettingsComponent implements OnInit, OnChanges {
    @Input() mapreference: any;
    postcode = new FormControl(null, null);
    latitude = new FormControl(null, null);
    longitude = new FormControl(null, null);
    selectedMap = new FormControl(null, null);
    zoomLevel = 9;
    showMapScale = false;
    @Output() changeMapType = new EventEmitter<string>();
    mapTypes = tilelayerOptions;
    scale: L.Control.Scale;
    selectedMapType = "Default";

    constructor(private notificationService: NotificationService, private postcodeService: PostcodeService) {}

    ngOnChanges() {
        if (this.mapreference && !this.latitude.value) {
            this.setCenter();
        }
    }

    ngOnInit() {
        this.loadDefault();
        console.log(this.mapTypes);
    }

    setCenter() {
        this.latitude.setValue(this.mapreference.getCenter().lat);
        this.longitude.setValue(this.mapreference.getCenter().lng);
    }

    postcodeLookup() {
        if (this.postcode.value) {
            this.postcodeService.getByPostcode(this.postcode.value).subscribe(
                (res: any) => {
                    if (res && res.status === 200 && res.result) {
                        this.centerChange({ lat: res.result.latitude, lng: res.result.longitude });
                    } else {
                        this.notificationService.info("Unable to find postcode from database.");
                    }
                },
                () => {
                    this.notificationService.info("Unable to find postcode from database.");
                }
            );
        } else {
            this.notificationService.info("Please enter a postcode");
        }
    }

    latlngLookup() {
        if ((this.latitude.value, this.longitude.value)) {
            this.centerChange({ lat: this.latitude.value, lng: this.longitude.value });
        } else {
            this.notificationService.info("Please enter a latitude and longitude");
        }
    }

    postcodeKeyUp(e: any) {
        if (e.key === "Enter" || e.keyCode === 13) {
            this.postcodeLookup();
        }
    }

    centerChange(e: { lat: number; lng: number }) {
        this.mapreference.setView(L.latLng(e.lat, e.lng), this.zoomLevel);
        this.latitude.setValue(e.lat);
        this.longitude.setValue(e.lng);
    }

    zoomLevelChange(e: any) {
        this.zoomLevel = e.value;
        this.mapreference.setZoom(this.zoomLevel);
    }

    showMapScaleChange() {
        if (this.showMapScale) {
            this.scale = L.control.scale();
            this.scale.addTo(this.mapreference);
        } else {
            if (this.scale) this.scale.remove();
        }
    }

    changeMapTypeChange(e: any) {
        this.selectedMapType = e.value;
        this.changeMapType.emit(e.value);
    }

    saveDefault() {
        sessionStorage.setItem(
            "defaultMapSettings",
            JSON.stringify({
                zoomLevel: this.zoomLevel,
                showMapScale: this.showMapScale,
                mapType: this.selectedMapType,
                lat: this.latitude.value,
                lng: this.longitude.value,
            })
        );
        this.notificationService.info("Default settings saved to local storage");
        // TODO: save to database
    }

    loadDefault() {
        // TODO: load from database
        const defaultMapSettings = JSON.parse(sessionStorage.getItem("defaultMapSettings"));
        if (defaultMapSettings) {
            this.zoomLevel = defaultMapSettings.zoomLevel;
            this.showMapScale = defaultMapSettings.showMapScale;
            this.selectedMapType = defaultMapSettings.mapType;
            this.selectedMap.setValue(defaultMapSettings.mapType);
            this.latitude.setValue(defaultMapSettings.lat);
            this.longitude.setValue(defaultMapSettings.lng);
            this.showMapScaleChange();
            this.centerChange({ lat: defaultMapSettings.lat, lng: defaultMapSettings.lng });
            this.changeMapTypeChange({ value: this.selectedMapType });
        }
    }
}

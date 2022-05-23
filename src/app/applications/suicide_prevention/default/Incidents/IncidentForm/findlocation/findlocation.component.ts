import { Component, OnInit, Output, EventEmitter, ViewChild, Input, OnChanges } from "@angular/core";
import { FormGroup, FormControl, FormGroupDirective } from "@angular/forms";
import { latLng, tileLayer, TileLayer, LatLng } from "leaflet";
import * as L from "leaflet";
import { NotificationService } from "src/app/_services/notification.service";
import { iLocation } from "src/app/_models/SPI_Lookups";
import { PostcodeService } from "src/app/_services/postcodes.service";
import { Postcodes } from "diu-component-library";

export class MapData {
    layers?: any;
    options: MapDataOptions;
    markerCluster?: any;
}

export class MapDataOptions {
    layers?: TileLayer[];
    zoom: number;
    center: LatLng;
}

@Component({
    selector: "app-findlocation",
    templateUrl: "./findlocation.component.html",
})
export class FindlocationComponent implements OnInit, OnChanges {
    @Input() read?: iLocation;
    mapHeight = { height: "40vh" };
    mapStyle = { display: "block" };
    mapRender = false;
    MapCenter = latLng(53.838759, -2.909497);
    MapZoom = 10;
    MapBounds: any;
    pinGroup: any;
    MapData: MapData = {
        options: {
            layers: [
                tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 18,
                    minZoom: 8,
                    attribution: "...",
                }),
            ],
            zoom: 10,
            center: latLng(53.838759, -2.909497),
        },
        layers: [],
    };
    @Output() updated = new EventEmitter<iLocation>();
    locationForm = new FormGroup({
        postcode: new FormControl(null, null),
    });
    @ViewChild(FormGroupDirective, { static: false })
        formDirective: FormGroupDirective;
    selectedLocation: Postcodes;
    location: iLocation;

    constructor(private postcodeService: PostcodeService, private notificationService: NotificationService) {}

    ngOnInit() {}

    ngOnChanges() {
        if (this.read && this.read.postcode) {
            this.locationForm.controls.postcode.patchValue(this.read.postcode);
            this.findLocation();
        }
    }

    findLocation() {
        const postcode = this.locationForm.controls.postcode.value.toString();
        if (postcode) {
            this.postcodeService.getByPostcode(postcode.split(" ").join("").toLowerCase()).subscribe((data: Postcodes) => {
                if (data.status === 200) {
                    this.selectedLocation = data;
                    this.mapStyle = { display: "block" };
                    this.MapCenter = latLng(data.result.latitude, data.result.longitude);
                    this.MapZoom = 15;
                    this.addMarker(data.result.latitude, data.result.longitude, this.pinGroup, this.MapData);
                    setTimeout(() => {
                        this.mapRender = !this.mapRender;
                    }, 100);
                    this.location = {
                        postcode: data.result.postcode,
                        eastings: data.result.eastings.toString(),
                        northings: data.result.northings.toString(),
                        latitude: data.result.latitude.toString(),
                        longitude: data.result.longitude.toString(),
                    };
                    this.updated.emit(this.location);
                } else {
                    this.notificationService.warning("No address found for this postcode");
                }
            });
        } else {
            this.notificationService.warning("No Postcode entered");
        }
    }

    addMarker(lat, lng, layer, map) {
        const newlayer = new L.LayerGroup();
        if (layer) {
            map.layers.splice(layer, 1);
        } else {
            layer = new L.LayerGroup();
        }
        const color = { color: "red" };
        this.pinGroup = L.marker(
            {
                lat,
                lng,
            },
            {
                icon: new L.Icon({
                    iconUrl: "assets/images/marker-icon-2x-" + color.color + ".png",
                    shadowUrl: "assets/images/marker-shadow.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                }),
            }
        ).addTo(newlayer);
        map.layers.push(newlayer);
    }

    clearLocation() {
        this.location = null;
        this.locationForm.controls.postcode.patchValue(null);
        this.MapData = {
            options: {
                layers: [
                    tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        maxZoom: 18,
                        minZoom: 8,
                        attribution: "...",
                    }),
                ],
                zoom: 10,
                center: latLng(53.838759, -2.909497),
            },
            layers: [],
        };
        this.updated.emit(null);
    }
}

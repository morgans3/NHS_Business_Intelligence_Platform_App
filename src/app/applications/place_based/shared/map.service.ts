import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
    latLng as LLatLng,
    tileLayer as LTileLayer,
    map as LMap,
    geoJSON as LGeoJSON,
    marker as LMarker,
    icon as LIcon
} from "leaflet";
import { MarkerClusterGroup as LMarkerClusterGroup } from "leaflet.markercluster";
import { Router } from "@angular/router";
import { DatasetService } from "./dataset.service";

interface Map {
    mapInstance: any,
    layers?: Array<any>;
}

@Injectable()
export class MapService {
    public maps: Array<Map> = [];
    public selectedMapIndex = new BehaviorSubject(0);
    public selectedFeature = new BehaviorSubject(null);

    constructor(
        private router: Router,
        private datasetService: DatasetService
    ) { }

    syncingMaps = false;
    createMap(mapElement, options = null) {
        // Create map
        const map = LMap(mapElement, {
            layers: [
                LTileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    // maxZoom: 18,
                    // minZoom: 8,
                    attribution: "...",
                }),
            ],
            zoom: 9,
            preferCanvas: true,
            center: LLatLng(53.838759, -2.909497)
        });

        // Listen for map changes
        map.addEventListener("zoomend moveend", () => {
            // Sync other maps
            if(this.syncingMaps === false) {
                this.syncingMaps = true;
                this.maps.forEach((item) => {
                    if(item.mapInstance !== map) {
                        item.mapInstance.setView(map.getCenter(), map.getZoom());
                    }
                });
                this.syncingMaps = false;
            }

            // Update layers?
            const datasets = this.datasetService.datasets.value;
            const dynamicLayers = this.maps[this.selectedMapIndex.value].layers.filter((layer) => layer.dynamic === true);
            dynamicLayers.forEach((layer) => {
                const layerDataset = datasets.find((dataset) => dataset.id === layer.id);
                layerDataset.data(this.maps[this.selectedMapIndex.value].mapInstance, layer.layerInstance).then((newGeoJSONData) => {
                    if(newGeoJSONData !== false) {
                        layer.layerInstance.clearLayers();
                        layer.layerInstance.addLayer(
                            this.createGeoJsonLayer(newGeoJSONData, {
                                color: layer.color
                            })
                        );
                    }
                });
            });
        });

        // Store instance
        this.maps.push({ mapInstance: map, layers: [] });
    }

    private createGeoJsonLayer(data, options = null) {
        return LGeoJSON(data, {
            onEachFeature: (feature, layer) => {
                layer.addEventListener("click", () => {
                    this.selectedFeature.next(feature);
                    this.router.navigateByUrl("/apps/mapping/map-feature");
                });
            },
            pointToLayer: (feature, latlng) => {
                return LMarker(latlng, {
                    icon: new LIcon({
                        iconUrl: "/assets/images/marker-icon-2x-" + options.color + ".png",
                        shadowUrl: "/assets/images/marker-shadow.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                    }),
                });
            }
        })
    }

    async addDataset(dataset) {
        // Create cluster group
        const geoJSONLayer = new LMarkerClusterGroup();

        // Get layer color
        // eslint-disable-next-line max-len
        const layerColor = ["aqua", "black", "blue", "gold", "green", "grey", "lightred", "orange", "pink", "red", "violet", "yellow"][Math.floor(Math.random() * 12) + 1];

        // Get data?
        let geoJSONData;
        if (typeof dataset.data === "function") {
            geoJSONData = await dataset.data(
                this.maps[this.selectedMapIndex.value].mapInstance,
                geoJSONLayer
            );
        } else {
            geoJSONData = dataset.data;
        }

        // Create geojson layer
        geoJSONLayer.addLayer(
            this.createGeoJsonLayer(geoJSONData, {
                color: layerColor
            })
        );

        // Add to map
        this.maps[this.selectedMapIndex.value].mapInstance.addLayer(geoJSONLayer);

        // Add layer
        this.maps[this.selectedMapIndex.value].layers.push({
            id: dataset.id,
            title: dataset.title,
            color: layerColor,
            layerInstance: geoJSONLayer,
            dynamic: (typeof dataset.data === "function")
        });
    }

    removeDataset(dataset) {
        // Find corresponding layer
        const index = this.maps[this.selectedMapIndex.value].layers.findIndex((layer) => layer.id === dataset.id);

        // Remove layer from leaflet
        this.maps[this.selectedMapIndex.value].mapInstance.removeLayer(
            this.maps[this.selectedMapIndex.value].layers[index].layerInstance
        );

        // Remove from array
        this.maps[this.selectedMapIndex.value].layers.splice(index, 1);
    }
}

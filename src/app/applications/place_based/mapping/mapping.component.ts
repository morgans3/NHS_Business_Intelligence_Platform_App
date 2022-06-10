import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { latLng, tileLayer } from "leaflet";
import * as L from "leaflet";
import { legendColors } from "./colorlist";
import { iMapData, iMappingDashboard } from "../../../_models/mapping.interface";
import "node_modules/leaflet-sidebar-v2/js/leaflet-sidebar.min.js";
import { getTileLayer } from "./tilelayeroptions";

@Component({
    selector: "app-pb-mapping",
    templateUrl: "./mapping.component.html",
    styleUrls: ["./mapping.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class MappingComponent implements OnInit {
    mapHeight = { height: "100vh" };
    mapStyle = { display: "block" };
    mapRender = false;
    MapCenter = latLng(53.838759, -2.909497);
    MapZoom = 9;
    MapBounds: any;
    pinGroup: any;
    MapData: iMapData = {
        options: {
            layers: [
                tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 18,
                    minZoom: 8,
                    attribution: "...",
                }),
            ],
            zoom: 9,
            center: latLng(53.838759, -2.909497),
        },
        layers: [],
    };
    mapLegend: any[] = [];
    selectedDashboard: iMappingDashboard = {
        name: "New Dashboard",
        author: null,
        lastUpdated: new Date(),
        datasets: [],
    };
    mapObject: any;
    sidebarOptions: any = {
        position: "left",
        autopan: false,
        closeButton: false,
        container: "sidebar",
    };
    sidebarPanels = [
        { id: "home", title: "Place Based Intelligence", icon: "fas fa-bars" },
        { id: "upload", title: "Datasets", icon: "fas fa-database" },
        { id: "views", title: "Saved Views", icon: "fas fa-star" },
        { id: "filter", title: "Filter", icon: "fas fa-filter" },
        { id: "legend", title: "Legend", icon: "fas fa-map-marked" },
        { id: "settings", title: "Settings", position: "bottom", icon: "fas fa-wrench" },
    ];

    constructor() {}

    ngOnInit() {}

    drawMap(mapData: any[]) {
        this.MapData.layers = [];
        const newMarkers = new L.LayerGroup();
        this.mapLegend = [];
        mapData.forEach((element) => {
            const type = this.getIconType(element);
            let blnFoundLegend = false;
            this.mapLegend.forEach((item) => {
                if (item.displayName === type.displayName) {
                    blnFoundLegend = true;
                    item.total++;
                }
            });
            if (!blnFoundLegend) {
                this.mapLegend.push({ displayName: type.displayName, total: 1, marker: type.color });
            }
            L.marker(
                {
                    lat: element.latitude || element.lat,
                    lng: element.longitude || element.lng,
                },
                {
                    icon: new L.Icon({
                        iconUrl: "assets/images/marker-icon-2x-" + type.color + ".png",
                        shadowUrl: "assets/images/marker-shadow.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                    }),
                }
            )
                .bindPopup(this.createPopup(element))
                .addTo(newMarkers);
        });
        this.MapData.layers.push(newMarkers);
    }

    createPopup(item) {
        let popup = `<div>`;
        popup += `<h4>${item.name as string}</h4>`;
        Object.keys(item).forEach((key) => {
            if (key !== "name" && key !== "latitude" && key !== "longitude") {
                popup += `<p>${key}: ${item[key] as string}</p>`;
            }
        });
        popup += `</div>`;
        return L.popup({ maxWidth: 500 }).setContent(popup);
    }

    getIconType(item) {
        if (item.type) {
            return { displayName: item.type, color: this.getColor(item.type) };
        }
        return { displayName: "Other", color: "red" };
    }

    getColor(type: string) {
        const previous = this.mapLegend.filter((x) => x.displayName === type);
        if (previous.length > 0) return previous[0].marker;
        const items = legendColors.filter((x) => x !== type);
        const item = items[Math.floor(Math.random() * items.length)];
        if (items.length === 0) return "red";
        return item;
    }

    setMapObject(mapObject: any) {
        this.mapObject = mapObject;
        const zoomcontrol = document.getElementsByClassName("leaflet-control-zoom")[0];
        zoomcontrol.remove();
        const layerControlParentLayer = L.control({
            position: "topleft",
        });
        layerControlParentLayer.onAdd = () => {
            const parentDiv = L.DomUtil.create("div");
            parentDiv.setAttribute("id", "layer-control-parent-id");
            parentDiv.setAttribute("style", "background-color: white; border-radius: 10px;");
            const sliderDiv = L.DomUtil.create("div", "slider-div-class", parentDiv);
            const imageOverlayUrl = "assets/images/nexusgen_crop.png";
            sliderDiv.innerHTML = `<img src="${imageOverlayUrl}" style="width: 230px; height: 87px; padding:5px">`;
            L.DomEvent.disableClickPropagation(parentDiv);
            return parentDiv;
        };
        layerControlParentLayer.addTo(mapObject);
        L.control
            .zoom({
                position: "topleft",
            })
            .addTo(mapObject);
        this.addSidebar();
    }

    addSidebar() {
        this.sidebarPanels.forEach((panel) => {
            this.addSidebarPanel(panel);
        });
    }

    addSidebarPanel(panel: any) {
        const sidebar = L.control.sidebar(this.sidebarOptions).addTo(this.mapObject);
        const position = panel.position || "top";
        const panelContent = {
            id: panel.id,
            tab: `<i class="${panel.icon as string}" title="${panel.title as string}"></i>`,
            // pane: `<p>${panel.title}</p>`,
            // title: panel.title,
            position,
        };
        sidebar.addPanel(panelContent);
    }

    filterData(event) {
        // TODO: ???
        console.log(event);
    }

    changeTileLayer(label: string) {
        this.MapData = {
            options: {
                layers: [getTileLayer(label)],
                zoom: 9,
                center: latLng(53.838759, -2.909497),
            },
            layers: this.MapData.layers,
        };
    }
}

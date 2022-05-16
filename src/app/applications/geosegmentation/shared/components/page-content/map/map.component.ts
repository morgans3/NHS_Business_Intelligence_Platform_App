import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewChecked,
  ChangeDetectorRef,
  OnInit,
  OnChanges
} from "@angular/core";
import { DTOComponents } from "../../../../_models/PageEntities";
import { latLng, tileLayer, circle, TileLayer, LatLng } from "leaflet";
import * as L from "leaflet";
import "leaflet-draw";

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
  selector: "app-map",
  template: `
    <div
      [id]="MapName"
      class="leafletmap"
      leaflet
      leafletDraw
      [leafletOptions]="defaultoptions"
      [leafletDrawOptions]="drawOptions"
      [leafletLayers]="inMapData.layers || null"
      [(leafletZoom)]="zoom"
      [(leafletCenter)]="center"
      (leafletMapZoomEnd)="handleMapZoomEnd($event)"
      (leafletMapMoveEnd)="handleMapCenterEnd()"
      (leafletMapReady)="onMapReady($event)"
      (leafletDrawStop)="drawStopped($event)"
    ></div>
  `,
  styles: []
})
export class MapComponent implements OnInit, OnChanges, AfterViewChecked {
  component?: DTOComponents;
  @Input() rerender?: boolean;
  rerendertrigger = false;
  @Input() MapData?: MapData;
  @Input() MapName: string;
  @Input() MapZoom: number;
  zoom: number;
  oldzoom: number;
  @Input() MapCenter: any;
  center: any;
  oldcenter: any;
  fitBounds: any;
  @Output() CenterChange = new EventEmitter();
  @Output() ZoomChange = new EventEmitter();
  @Output() MapChange = new EventEmitter();
  mapreference: any;
  inMapData: MapData;
  drawOptions = {
    position: "topleft",
    draw: {
      marker: {
        icon: L.icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: "assets/images/marker.png"
          // shadowUrl: "assets/images/marker-shadow.png"
        })
      },
      polyline: false,
      circle: {
        shapeOptions: {
          color: "#aaaaaa"
        }
      }
    }
  };

  get defaultoptions() {
    return (
      this.inMapData.options || {
        layers: [
          tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 12,
            minZoom: 8,
            attribution: "..."
          })
        ],
        zoom: 10,
        center: latLng(53.789995, -3.024889)
      }
    );
  }

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.MapData) {
      this.inMapData = this.MapData;
      this.oldzoom = this.MapZoom;
      this.oldcenter = this.MapCenter;
      if (this.rerender !== undefined) {
        this.rerendertrigger = this.rerender;
      }
    }
  }

  ngOnChanges() {
    if (this.MapData && this.MapData !== this.inMapData) {
      this.inMapData = this.MapData;
      this.changeDetector.detectChanges();
    }
    if (this.oldzoom !== this.MapZoom) {
      this.updateZoom();
      this.oldzoom = this.MapZoom;
      this.changeDetector.detectChanges();
    }
    if (this.oldcenter !== this.MapCenter) {
      this.updateCenter();
      this.oldcenter = this.MapCenter;
      this.changeDetector.detectChanges();
    }
    if (this.rerender !== undefined && this.rerender !== this.rerendertrigger) {
      this.rerendertrigger = this.rerender;
      setTimeout(() => {
        this.mapreference.invalidateSize();
        this.mapreference._resetView(
          this.mapreference.getCenter(),
          this.mapreference.getZoom(),
          true
        );
      }, 200);
      this.changeDetector.detectChanges();
    }
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  handleMapZoomEnd(map: L.Map): void {
    const newValues = {
      zoom: this.zoom,
      center: this.center,
      bounds: this.createPolygonFromBounds(this.mapreference.getBounds())
    };
    this.ZoomChange.emit(newValues);
  }

  handleMapCenterEnd(): void {
    const newValues = {
      zoom: this.zoom,
      center: this.center,
      bounds: this.createPolygonFromBounds(this.mapreference.getBounds())
    };
    this.CenterChange.emit(newValues);
  }

  createPolygonFromBounds(latLngBounds) {
    const center = this.center;
    const latlngs = [];
    latlngs.push(latLngBounds.getSouthWest()); //bottom left
    latlngs.push({ lat: latLngBounds.getSouth(), lng: center.lng }); //bottom center
    latlngs.push(latLngBounds.getSouthEast()); //bottom right
    latlngs.push({ lat: center.lat, lng: latLngBounds.getEast() }); // center right
    latlngs.push(latLngBounds.getNorthEast()); //top right
    latlngs.push({ lat: latLngBounds.getNorth(), lng: center.lng }); //top center
    latlngs.push(latLngBounds.getNorthWest()); //top left
    latlngs.push({ lat: center.lat, lng: latLngBounds.getWest() }); //center left
    return latlngs;
  }

  onMapReady(map) {
    this.mapreference = map;
    console.log(this.mapreference.getBounds());
  }

  updateZoom() {
    if (this.mapreference._zoom !== this.MapZoom) {
      this.zoom = this.MapZoom;
    }
  }

  updateCenter() {
    this.mapreference.panTo(this.MapCenter);
  }

  drawStopped(event) {
    console.log(event);
  }
}
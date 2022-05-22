import { TileLayer, LatLng } from "leaflet";

export interface iMappingDashboard {
    name: string;
    author: string;
    teamAccess?: string[];
    center?: string;
    zoom?: string;
    legendFields?: string[];
    legendColours?: { value: string; colour: string }[];
    range?: { start?: Date; end?: Date };
    lastUpdated: Date;
    datasets: string[];
    customMarkers?: any[];
}

export class iMapData {
    layers?: any;
    options: iMapDataOptions;
    markerCluster?: any;
}

export class iMapDataOptions {
    layers?: TileLayer[];
    zoom: number;
    center: LatLng;
}

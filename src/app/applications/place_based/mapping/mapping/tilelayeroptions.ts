import * as L from "leaflet";

export const tilelayerOptions = [
    {
        value: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        label: "Default",
        attribution: "...",
    },
    {
        value: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        label: "Warm",
        attribution: "...",
    },
    {
        value: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        label: "Satellite",
        attribution: "...",
    },
    {
        value: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
        label: "Dark",
        attribution: "...",
    },
    {
        value: "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png",
        label: "Bright",
        attribution: "...",
    },
    {
        value: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png",
        label: "Toner",
        attribution: "...",
    },
    {
        value: "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png",
        label: "Watercolor",
        attribution: "...",
    },
];

export const getTileLayer = (label: string, maxZoom?: any, minZoom?: any) => {
    const layer = tilelayerOptions.find((item) => item.label === label);
    const options = {
        attribution: layer.attribution || "...",
        maxZoom: maxZoom || 18,
        minZoom: minZoom || 8,
    };
    let url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    if (layer) url = layer.value;
    return new L.TileLayer(url, options);
};

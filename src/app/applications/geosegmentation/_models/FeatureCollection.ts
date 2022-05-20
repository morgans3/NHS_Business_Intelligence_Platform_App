export interface FeatureCollection {
    type: "FeatureCollection";
    name?: string;
    crs: Crs;
    features: Feature[];
}

interface Feature {
    type: string;
    id?: number;
    properties: MosaicProperties;
    geometry: Geometry;
}

interface Geometry {
    type: string;
    coordinates: any;
}

interface MosaicProperties {
    MosaicType?: string;
    MosaicGroup?: string;
    POSTCODE?: string;
    // MosType?: string;
    Pop?: number;
    rmapshaperid?: number;
    f1?: string;
    f2?: number;
}

interface Crs {
    type: string;
    properties: Properties;
}

interface Properties {
    name: string;
}

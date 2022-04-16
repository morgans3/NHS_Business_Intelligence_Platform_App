export class Chart {
  title: string;
  type: string;
  dim: any;
  group: any;
  name: string;
  ordinalColors?: string[];
  colours?: string[];
  renderLabel?: boolean;
  containerHeight?: string;
  tooltip?: string;
}

export class PieChart extends Chart {}

export class BarChart extends Chart {
  xUnits?: string;
  elasticY?: boolean;
  elasticX?: boolean;
  round?: any;
  alwaysUseRounding?: boolean;
  x?: string;
  renderHorizontalGridLines?: boolean;
  xAxisTicks?: any;
  xAxisTickFormat?: string;
  yAxisTicks?: number;
  yAxisTickFormat?: string;
  gap?: number;
  ordering?: string;
  ordinalColors?: string[];
  colorDomain?: string[];
  colorAccessor?: any;
  centerBar?: boolean;
  xstart?: Date;
  xend?: Date;
  xAxis?: boolean;
  timeticks?: string;
  timeformat?: string;
}

export class RowChart extends Chart {
  xUnits?: string;
  elasticY?: boolean;
  elasticX?: boolean;
  round?: any;
  alwaysUseRounding?: boolean;
  x?: string;
  renderHorizontalGridLines?: boolean;
  xAxisTicks?: number;
  xAxisTickFormat?: string;
  yAxisTicks?: number;
  yAxisTickFormat?: string;
  gap?: number;
  ordering?: string;
  ordinalColors?: string[];
  colorDomain?: string[];
  colorAccessor?: boolean;
  cap?: number;
}

export class LeafletChoroplethChart extends Chart {
  mapOptions?: any;
  center?: number[];
  zoom?: number;
  map?: any;
  geojson?: any;
  featureOptions?: any;
  featureKeyAccessor?: any;
  colorDomain?: number[];
  colorAccessor?: any;
  popup?: any;
  renderPopup?: boolean;
  brushOn?: boolean;
  legend?: any;
}

export class LeafletMarkerChart extends LeafletChoroplethChart {
  circleScale?: any;
  locationAccessor?: any;
}

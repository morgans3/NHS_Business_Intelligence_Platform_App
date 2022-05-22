export class Chart {
    title: string;
    type: string;
    dim: any;
    group: any;
    name: string;
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
    xAxisTicks?: number;
    xAxisTickFormat?: string;
    yAxisTicks?: number;
    yAxisTickFormat?: string;
    gap?: number;
    ordering?: string;
    ordinalColors?: string[];
    colorDomain?: string[];
    colorAccessor?: boolean;
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

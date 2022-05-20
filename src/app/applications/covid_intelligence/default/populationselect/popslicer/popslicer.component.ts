import { Component, OnInit, ElementRef, ViewChild, HostListener } from "@angular/core";
import {
    DeprivationColors,
    RowChart,
    BarChart,
    PieChart,
    HeatMap,
    LeafletChoroplethChart,
    LeafletMarkerChart,
    FeatureCollection,
    MosaicColours,
    MosaicDomain,
    MosaicCode,
    PopulationPerson,
    APIService,
    PopulationManagementService,
} from "diu-component-library";
import { collapseAnimations } from "../../../../../shared/animations";
import * as dcFull from "dc";
import * as d3 from "d3";
import { Store } from "@ngxs/store";
import { AuthState } from "../../../../../_states/auth.state";
import { MatDialog } from "@angular/material/dialog";
import { JoyrideService } from "ngx-joyride";
import { NotificationService } from "../../../../../_services/notification.service";
import { ExpandTextDialogComponent } from "../../../_modals/dialogexpand";
declare let leafletChoroplethChart: any;
declare let leafletLegend: any;
declare let leafletMarkerChartBubble: any;
declare let dc: any;
declare let window: any;
declare let L: any;
import { RiskRows, RiskCols, CareModelExamples } from "./RiskRows";

export class StatCardData {
    title: string;
    value: string;
    color: string;
    icon: string;
    text?: string;
    subvalue?: string;
    subvaluetext?: string;
}

@Component({
    selector: "app-popslicer",
    templateUrl: "./popslicer.component.html",
    styleUrls: ["./popslicer.component.scss"],
    animations: [collapseAnimations],
})
export class PopslicerComponent implements OnInit {
    /* #region Global Variables */
    RiskRows = RiskRows;
    RiskCols = RiskCols;
    CareModelExamples = CareModelExamples;
    resetBtnPushed = false;
    loadFilters = {};
    token: string;
    @ViewChild("ageChartParent") ageChartParent: ElementRef;
    @ViewChild("riskChartParent") riskChartParent: ElementRef;
    @ViewChild("sexChartParent") sexChartParent: ElementRef;
    @ViewChild("mosaicChartParent") mosaicChartParent: ElementRef;
    @ViewChild("matrixChartParent") matrixChartParent: ElementRef;
    @ViewChild("ltcChartParent") ltcChartParent: ElementRef;
    @ViewChild("countltcChartParent") countltcChartParent: ElementRef;
    @ViewChild("deprivationChartParent") deprivationChartParent: ElementRef;
    @ViewChild("ewChartParent") ewChartParent: ElementRef;
    @ViewChild("gpChartParent") gpChartParent: ElementRef;
    @ViewChild("flagChartParent") flagChartParent: ElementRef;
    @ViewChild("countflagChartParent") countflagChartParent: ElementRef;
    mosaicCodes: MosaicCode[];
    loading = true;
    popCube: any;
    ndx: any;
    LDimension: any;
    LDimGroup: any;
    GPDimension: any;
    GPDimGroup: any;
    UDimension: any;
    UDimGroup: any;
    LTCsDimension: any;
    LTCsDimGroup: any;
    LTCs2Dimension: any;
    LTCs2DimGroup: any;
    numberSelLtc: any;
    numberSelLtcs: any;
    FlagsDimension: any;
    FlagsDimGroup: any;
    Flags2Dimension: any;
    Flags2DimGroup: any;
    numberSelFlag: any;
    numberSelFlags: any;
    SexDimension: any;
    SexDimGroup: any;
    MDimension: any;
    MDimGroup: any;
    MatrixDimension: any;
    MatrixDimGroup: any;
    CCGDimension: any;
    CCGDimGroup: any;
    ICPDimension: any;
    ICPDimGroup: any;
    LCntDimension: any;
    LCntDimGroup: any;
    FCntDimension: any;
    FCntDimGroup: any;
    AgeDimension: any;
    AgeDimGroup: any;
    RskDimension: any;
    RskDimGroup: any;
    DDimension: any;
    DDimGroup: any;
    WDimension: any;
    WDimGroup: any;
    myDC: any;
    all: any;
    ewChart: any;
    ewmapChartDetails: LeafletChoroplethChart;
    ewChartOpenCloseAnim = "open";
    leafletMapRenderedWard = false;
    gpChart: any;
    gpmapChartDetails: LeafletMarkerChart;
    gpMapShowMarkers = false;
    gpChartOpenCloseAnim = "open";
    leafletMapRenderedGP = false;
    gpCircleScalingFactor = 1000;
    GpLookup = {};
    gpNameLookup = {};
    GPs: any;
    sexChart: any;
    sexChartDetails: PieChart;
    sexChartOpenCloseAnim = "open";
    ageChart: any;
    ageChartDetails: BarChart;
    ageChartOpenCloseAnim = "open";
    riskChart: any;
    riskChartDetails: BarChart;
    riskChartOpenCloseAnim = "open";
    mosaicChart: any;
    mosaicChartDetails: BarChart;
    mosaicChartOpenCloseAnim = "close";
    matrixChart: any;
    matrixChartDetails: HeatMap;
    matrixChartOpenCloseAnim = "close";
    ltcChart: any;
    ltcChartDetails: RowChart;
    ltcChartOpenCloseAnim = "open";
    flagChart: any;
    flagChartDetails: RowChart;
    flagChartOpenCloseAnim = "open";
    countltcChart: any;
    countltcChartDetails: RowChart;
    countltcChartOpenCloseAnim = "open";
    countflagChart: any;
    countflagChartDetails: RowChart;
    countflagChartOpenCloseAnim = "open";
    deprivationChart: any;
    deprivationChartDetails: RowChart;
    deprivationChartOpenCloseAnim = "open";
    noSelectedLtcsSelect: dc.SelectMenu;
    noSelectedFlagsSelect: dc.SelectMenu;
    ccgSelect: dc.SelectMenu;
    icpSelect: dc.SelectMenu;
    neighbourhoodSelect: dc.SelectMenu;
    TotalPopulation: any;
    CustBaseline: any;
    TotalSelected: any;
    PercentSelected: any;
    patientsCount: any;
    customBaseline = null;
    selectedPopulation = 0;
    keyToolTip: any;
    matrixToolTip: any;
    population: PopulationPerson[];
    filteredData: any;
    queryFilter: any = {};
    lastQueryFilter: any = {};
    totalsize: number;
    wards: FeatureCollection;
    refocused = true;

    dropCCG: any;
    dropNeighbourhood: any;

    icpPopulation: StatCardData = {
        title: "ICS POPULATION INCLUDED",
        value: "TotalPopulation",
        icon: "group",
        color: "bg-warning",
    };
    customPopulation: StatCardData = {
        title: "CUSTOM POPULATION",
        value: "CustBaseline",
        icon: "group",
        color: "bg-danger",
    };
    selectedPop: StatCardData = {
        title: "SELECTED POPULATION",
        value: "TotalSelected",
        icon: "group",
        color: "bg-success",
    };
    selected: StatCardData = {
        title: "% SELECTED (Total | Custom)",
        value: "PercentSelected",
        icon: "group",
        color: "bg-primary",
    };
    origin: any;
    ewLoading = true;
    gpLoading = true;
    /* #endregion */

    @HostListener("window:resize", ["$event"])
    onResize() {
        setTimeout(() => {
            this.drawCharts();
        }, 0);
    }

    constructor(
        public store: Store,
        public dialog: MatDialog,
        private apiService: APIService,
        private populationManagementService: PopulationManagementService,
        private readonly joyrideService: JoyrideService,
        private notificationService: NotificationService
    ) {
        this.token = this.store.selectSnapshot(AuthState.getToken);
        const parsedUrl = window.location.href;
        this.origin = parsedUrl.replace("/populationselect", "");
        if (this.origin.includes("localhost")) {
            this.origin = "https://cvi.dev.nexusintelligencenw.nhs.uk";
        }
    }

    ngOnInit() {
        const tooltip_remove = d3.select("mat-sidenav-content").selectAll(".tooltip");
        tooltip_remove.remove();
        this.apiService.getMosiacs().subscribe((res: MosaicCode[]) => {
            this.mosaicCodes = res;
        });
        this.apiService.getWards().subscribe((data: FeatureCollection[]) => {
            this.wards = data[0];
            this.createEWMap(this.WDimension, this.WDimGroup);
            this.ewChart.render();
        });
        this.apiService.getGPPractices().subscribe((data: any[]) => {
            this.GPs = data[0];
            this.createGPMap(this.GPDimension, this.GPDimGroup);
            this.gpChart.render();
        });
        this.keyToolTip = d3.select("mat-sidenav-content").append("div").attr("class", "tooltip").style("opacity", 0);
        this.matrixToolTip = d3.select("mat-sidenav-content").append("div").attr("class", "tooltip").style("opacity", 0);
        this.myDC = dcFull;
        this.populationManagementService.getCFServer().subscribe((res: any) => {
            this.loading = false;
            this.filteredData = res;
            this.totalsize = this.filteredData["all"].values;
            if (this.totalsize === 0) {
                this.notificationService.info(
                    "There are no people in the dataset that you have access to view, you may need to request access to this data."
                );
            } else {
                this.buildCFServer();
                setTimeout(() => {
                    this.createCharts();
                    this.drawCharts();
                }, 100);
            }
        });
    }

    /* #region Cross Filter Server Functions */
    buildCFServer() {
        this.ndx = {
            size: () => {
                return this.totalsize;
            },
        };
        this.all = {
            value: () => {
                return this.filteredData["all"].values;
            },
        };
        this.LDimension = {
            filterName: () => "LDimension",
            filter: (f) => this.dimensionFunction("LDimension", f),
            filterAll: () => {},
        };
        this.LDimGroup = {
            all: () => {
                return this.filteredData["LDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.WDimension = {
            filterName: () => "WDimension",
            filter: (f) => {
                this.dimensionFunction("WDimension", f);
                this.refresh(this.queryFilter);
            },
            filterAll: () => {},
        };
        this.WDimGroup = {
            all: () => {
                return this.filteredData["WDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.GPDimension = {
            filterName: () => "GPDimension",
            filter: (f) => {
                this.dimensionFunction("GPDimension", f);
                this.refresh(this.queryFilter);
            },
            filterAll: () => {},
        };
        this.GPDimGroup = {
            all: () => {
                return this.filteredData["GPDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.UDimension = {
            filterName: () => "UDimension",
            filter: (f) => this.dimensionFunction("UDimension", f),
            filterAll: () => {},
        };
        this.UDimGroup = {
            all: () => {
                return this.filteredData["UDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.LTCsDimension = {
            filterName: () => "LTCsDimension",
            filter: (f) => this.dimensionFunction("LTCsDimension", f),
            filterAll: () => {},
        };
        this.LTCsDimGroup = {
            all: () => {
                return this.sortedArrayList(this.filteredData["LTCs2Dimension"].values);
            },
            order: () => {},
            top: () => {},
        };
        this.LTCs2Dimension = {
            filterName: () => "LTCs2Dimension",
            filter: (f) => this.dimensionFunction("LTCs2Dimension", f),
            filterAll: () => {},
        };
        this.LTCs2DimGroup = {
            all: () => {
                return this.sortedArrayList(this.filteredData["LTCs2Dimension"].values);
            },
            order: () => {},
            top: () => {},
        };
        this.FlagsDimension = {
            filterName: () => "FlagsDimension",
            filter: (f) => this.dimensionFunction("FlagsDimension", f),
            filterAll: () => {},
        };
        this.FlagsDimGroup = {
            all: () => {
                return this.sortedArrayList(this.filteredData["Flags2Dimension"].values);
            },
            order: () => {},
            top: () => {},
        };
        this.Flags2Dimension = {
            filterName: () => "Flags2Dimension",
            filter: (f) => this.dimensionFunction("Flags2Dimension", f),
            filterAll: () => {},
        };
        this.Flags2DimGroup = {
            all: () => {
                return this.sortedArrayList(this.filteredData["Flags2Dimension"].values);
            },
            order: () => {},
            top: () => {},
        };
        this.SexDimension = {
            filterName: () => "SexDimension",
            filter: (f) => this.dimensionFunction("SexDimension", f),
            filterAll: () => {},
        };
        this.SexDimGroup = {
            all: () => {
                return this.filteredData["SexDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.MDimension = {
            filterName: () => "MDimension",
            filter: (f) => this.dimensionFunction("MDimension", f),
            filterAll: () => {},
        };
        this.MDimGroup = {
            all: () => {
                return this.filteredData["MDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.MatrixDimension = {
            filterName: () => "MatrixDimension",
            filter: (f) => this.dimensionFunction("MatrixDimension", f),
            filterAll: () => {},
        };
        this.MatrixDimGroup = {
            all: () => {
                return this.filteredData["MatrixDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.CCGDimension = {
            filterName: () => "CCGDimension",
            filter: (f) => this.dimensionFunction("CCGDimension", f),
            filterAll: () => {},
        };
        this.CCGDimGroup = {
            all: () => {
                return this.filteredData["CCGDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.ICPDimension = {
            filterName: () => "ICPDimension",
            filter: (f) => this.dimensionFunction("ICPDimension", f),
            filterAll: () => {},
        };
        this.ICPDimGroup = {
            all: () => {
                return this.filteredData["ICPDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.numberSelLtc = {
            filterName: () => "numberSelLtc",
            filter: (f) => this.dimensionFunction("numberSelLtc", f),
            filterAll: () => {},
        };
        this.numberSelLtcs = {
            all: () => {
                if (this.filteredData["numberSelLtc"]) {
                    return this.filteredData["numberSelLtc"].values;
                } else {
                    return null;
                }
            },
            order: () => {},
            top: () => {},
        };
        this.LCntDimension = {
            filterName: () => "LCntDimension",
            filter: (f) => this.dimensionFunction("LCntDimension", f),
            filterAll: () => {},
        };
        this.LCntDimGroup = {
            all: () => {
                return this.filteredData["LCntDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.numberSelFlag = {
            filterName: () => "numberSelFlag",
            filter: (f) => this.dimensionFunction("numberSelFlag", f),
            filterAll: () => {},
        };
        this.numberSelFlags = {
            all: () => {
                if (this.filteredData["numberSelFlag"]) {
                    return this.filteredData["numberSelFlag"].values;
                } else {
                    return null;
                }
            },
            order: () => {},
            top: () => {},
        };
        this.FCntDimension = {
            filterName: () => "FCntDimension",
            filter: (f) => this.dimensionFunction("FCntDimension", f),
            filterAll: () => {},
        };
        this.FCntDimGroup = {
            all: () => {
                return this.filteredData["FCntDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.AgeDimension = {
            filterName: () => "AgeDimension",
            filter: (f) => this.dimensionFunction("AgeDimension", f),
            filterAll: () => {},
        };
        this.AgeDimGroup = {
            all: () => {
                return this.filteredData["AgeDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.RskDimension = {
            filterName: () => "RskDimension",
            filter: (f) => this.dimensionFunction("RskDimension", f),
            filterAll: () => {},
        };
        this.RskDimGroup = {
            all: () => {
                return this.filteredData["RskDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.DDimension = {
            filterName: () => "DDimension",
            filter: (f) => this.dimensionFunction("DDimension", f),
            filterAll: () => {},
        };
        this.DDimGroup = {
            all: () => {
                return this.filteredData["DDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
    }

    sumValues(arr: any) {
        let total = 0;
        arr.forEach((val) => (total += parseInt(val.key) * parseInt(val.value)));
        return total.toString();
    }

    dimensionFunction(name: string, f: any) {
        if (f && f.length > 0) {
            if (this.queryFilter[name] !== f) {
                this.queryFilter[name] = f;
            }
        } else {
            if (this.queryFilter[name]) {
                delete this.queryFilter[name];
            }
        }
    }

    async refresh(queryFilter) {
        if (queryFilter !== this.lastQueryFilter) {
            this.lastQueryFilter = JSON.parse(JSON.stringify(queryFilter));
            this.queryFilter = queryFilter;
            const header = [["Authorization", "JWT " + this.store.selectSnapshot(AuthState.getToken)]];
            const options: RequestInit = {
                method: "GET",
                headers: header,
            };
            await d3
                .json(this.origin.replace("cvi", "pmi") + "/populations/getCrossfilter?filter=" + JSON.stringify(queryFilter), options)
                .then((d) => {
                    if (this.filteredData !== d) {
                        this.filteredData = d;
                        this.myDC.redrawAll();
                        this.ewChart.redraw();
                        this.gpChart.redraw();
                        if (this.matrixChartOpenCloseAnim === "open") {
                            this.matrixChart.render();
                        }
                        this.ccgSelect.redraw();
                        this.icpSelect.redraw();
                        this.neighbourhoodSelect.redraw();
                        this.loadFilters = {};
                        this.loading = false;
                    }
                });
        }
        return null;
    }

    resetToWholePop() {
        this.resetBtnPushed = true;
        this.queryFilter = {};
        const header = [["Authorization", "JWT " + this.store.selectSnapshot(AuthState.getToken)]];
        const options: RequestInit = {
            method: "GET",
            headers: header,
        };
        d3.json(
            this.origin.replace("cvi", "pmi") + "/populations/getCrossfilter",
            options
            // {
            //   headers: new Headers({ Authorization: "JWT " + this.token })
            // }
        ).then((d) => {
            this.filteredData = d;
            this.myDC.filterAll();
            this.myDC.redrawAll();
            this.ewChart.redraw();
            this.gpChart.redraw();
            if (this.matrixChartOpenCloseAnim === "open") {
                this.matrixChart.render();
            }
            this.ccgSelect.redraw();
            this.icpSelect.redraw();
            this.neighbourhoodSelect.redraw();
            this.resetBtnPushed = false;
            this.loadFilters = {};
            this.loading = false;
            setTimeout(() => {
                if (this.selectedPopulation !== this.totalsize) {
                    this.resetToWholePop();
                }
            }, 100);
        });
    }

    sortedArrayList(values: { key: string[]; value: number }[]) {
        const response: { key: string[]; value: number }[] = [];
        values.forEach((keyvaluePair) => {
            const keyarray = keyvaluePair.key;
            keyarray.forEach((ltc) => {
                const check = response.filter((x) => x.key.includes(ltc));
                if (check.length > 0) {
                    check[0].value = check[0].value + keyvaluePair.value;
                } else {
                    response.push({ key: [ltc], value: keyvaluePair.value });
                }
            });
        });
        return response;
    }
    /* #endregion */

    createCharts() {
        const list = this.myDC.chartRegistry.list();
        if (list.length > 0) {
            this.myDC.chartRegistry.clear();
        }
        this.createSexChart(this.SexDimension, this.SexDimGroup);
        this.createAgeChart(this.AgeDimension, this.AgeDimGroup);
        this.createRiskChart(this.RskDimension, this.RskDimGroup);
        if (this.mosaicChartOpenCloseAnim === "open") {
            this.createMosaicChart(this.MDimension, this.MDimGroup);
        }
        if (this.matrixChartOpenCloseAnim === "open") {
            this.createMatrixChart(this.MatrixDimension, this.MatrixDimGroup);
        }
        this.createLTCChart(this.LTCs2Dimension, this.LTCs2DimGroup);
        this.createCountLTCChart(this.LCntDimension, this.LCntDimGroup);
        this.createFlagChart(this.Flags2Dimension, this.Flags2DimGroup);
        // this.createCountFlagChart(this.FCntDimension, this.FCntDimGroup);
        this.createDeprivationChart(this.DDimension, this.DDimGroup);
        if (this.wards) {
            this.createEWMap(this.WDimension, this.WDimGroup);
        }
        if (this.GPs) {
            this.createGPMap(this.GPDimension, this.GPDimGroup);
        }
        this.ccgSelect = this.myDC.selectMenu("#ccg-select");
        this.ccgSelect
            .dimension(this.CCGDimension)
            .group(this.CCGDimGroup)
            .controlsUseVisibility(true)
            // .multiple(true)
            .on("renderlet", (chart) => {
                chart.selectAll(".dc-select-option").call((t) => {
                    t.each(function () {
                        const self = d3.select(this);
                        const text = self.text();
                        const code = text.split(":");
                        if (code.length > 0) {
                            switch (code[0]) {
                                case "02M":
                                    self.text(text.replace(code[0], "Fylde & Wyre CCG"));
                                    break;
                                case "00R":
                                    self.text(text.replace(code[0], "Blackpool CCG"));
                                    break;
                                case "02G":
                                    self.text(text.replace(code[0], "W.Lancs CCG"));
                                    break;
                                case "00Q":
                                    self.text(text.replace(code[0], "Blackburn with Darwen CCG"));
                                    break;
                                case "00X":
                                    self.text(text.replace(code[0], "Chorley and South Ribble CCG"));
                                    break;
                                case "01A":
                                    self.text(text.replace(code[0], "East Lancs CCG"));
                                    break;
                                case "01E":
                                    self.text(text.replace(code[0], "Greater Preston CCG"));
                                    break;
                                case "01K":
                                    self.text(text.replace(code[0], "Lancashire North CCG"));
                                    break;
                                default:
                                    self.text(text.replace(code[0], "Out of Area"));
                                    break;
                            }
                        }
                    });
                });
            });
        this.ccgSelect.filterHandler((dim, filters) => this.filterHandled(dim, filters));
        this.icpSelect = this.myDC.selectMenu("#icp-select");
        this.icpSelect.dimension(this.ICPDimension).group(this.ICPDimGroup).controlsUseVisibility(true);
        this.icpSelect.filterHandler((dim, filters) => this.filterHandled(dim, filters));
        this.neighbourhoodSelect = this.myDC.selectMenu("#neighbourhood-select");
        this.neighbourhoodSelect.dimension(this.LDimension).group(this.LDimGroup).controlsUseVisibility(true);
        // .multiple(true);
        this.neighbourhoodSelect.filterHandler((dim, filters) => this.filterHandled(dim, filters));
    }

    filterHandled(dim, filters) {
        const name = dim.filterName();
        this.loadFilters[name] = true;
        this.loading = true;
        if (filters) {
            dim.filter(filters);
        } else {
            dim.filter(null);
        }
    }

    async redrawCharts(chart: any, dimName: string) {
        chart.filterAll();
        this.getDimensionFromName(dimName).filter(null);
        await this.refresh(this.queryFilter);
    }

    /* #region Header Values and Dropdown functions */
    updateSummaries() {
        const list = this.myDC.chartRegistry.list();
        if (list.length > 0) {
            list.forEach((e) => {
                const chart = list[e];
                if (
                    chart.anchorName() === "dc-data-count" ||
                    chart.anchorName() === "TotalPopulation" ||
                    chart.anchorName() === "CustBaseline" ||
                    chart.anchorName() === "TotalSelected" ||
                    chart.anchorName() === "PercentSelected"
                ) {
                    this.myDC.chartRegistry.deregister(chart);
                }
            });
        }
        this.patientsCount = this.myDC.numberDisplay("#dc-data-count");
        this.updatePatientsCount();
        this.TotalPopulation = this.myDC.numberDisplay("#TotalPopulation");
        this.TotalPopulation.dimension(this.ndx)
            .group(this.all)
            .formatNumber(() => {
                const total = this.patientsCount.dimension().size();
                return this.numberWithCommas(total);
            });
        this.CustBaseline = this.myDC.numberDisplay("#CustBaseline");
        this.CustBaseline.dimension(this.ndx)
            .group(this.all)
            .formatNumber(() => {
                return this.numberWithCommas(this.customBaseline);
            });
        this.TotalSelected = this.myDC.numberDisplay("#TotalSelected");
        this.TotalSelected.dimension(this.ndx)
            .group(this.all)
            .formatNumber(() => {
                const selectedCount = this.patientsCount.group().value();
                this.selectedPopulation = selectedCount;
                return this.numberWithCommas(this.selectedPopulation);
            });
        this.PercentSelected = this.myDC.numberDisplay("#PercentSelected");
        this.PercentSelected.dimension(this.ndx)
            .group(this.all)
            .formatNumber(() => {
                const selectedCount = this.patientsCount.group().value();
                const total = this.patientsCount.dimension().size();
                const percentTotal = this.humanize((100 * selectedCount) / total) + "%";
                let percentCustom;
                if (this.customBaseline === null || this.customBaseline === 0) {
                    percentCustom = "Not selected";
                } else {
                    percentCustom = this.humanize((100 * selectedCount) / this.customBaseline) + "%";
                }
                return percentTotal + " | " + percentCustom;
            });
        this.TotalPopulation.render();
        this.CustBaseline.render();
        this.TotalSelected.render();
        this.PercentSelected.render();
        this.patientsCount.render();
    }

    numberWithCommas(x) {
        if (x === null || typeof x === "undefined") {
            return "Nothing selected";
        } else {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    humanize(x) {
        if (typeof x === "undefined") {
            return "NA";
        } else {
            return x.toFixed(2).replace(/\.?0*$/, "");
        }
    }
    updatePatientsCount() {
        this.patientsCount
            .dimension(this.ndx)
            .group(this.all)
            .formatNumber(() => {
                const selectedCount = this.all.value();
                const total = this.ndx.size();
                if (selectedCount === total) {
                    return "All <strong>" + total + "</strong> records shown. ";
                }
                const percent = this.humanize((100 * selectedCount) / total);
                return (
                    "Selected <strong>" +
                    percent +
                    "%</strong> (<strong>" +
                    selectedCount +
                    "</strong> out of <strong>" +
                    total +
                    "</strong> records)"
                );
            });
    }
    /* #endregion */

    drawCharts() {
        if (this.ccgSelect === undefined) {
            return;
        }
        this.ccgSelect.render();
        this.icpSelect.render();
        this.neighbourhoodSelect.render();
        this.updateSummaries();
        if (this.ewChart) {
            if (this.ewChartOpenCloseAnim === "open") {
                this.resizeChart(this.ewChart, this.ewChartParent);
                if (!this.leafletMapRenderedWard) {
                    this.ewChart.render();
                    this.ewChart.redraw();
                }
            }
        }
        if (this.gpChart) {
            if (this.gpChartOpenCloseAnim === "open") {
                this.resizeChart(this.gpChart, this.gpChartParent);
                if (!this.leafletMapRenderedGP) {
                    this.gpChart.render();
                    if (this.ewChart) {
                        this.ewChart.redraw();
                    }
                }
            }
        }
        if (this.ageChartOpenCloseAnim === "open") {
            this.resizeChart(this.ageChart, this.ageChartParent);
            this.ageChart.render();
            this.ageChart.select("svg").attr("style", "background:white");
        }
        if (this.riskChartOpenCloseAnim === "open") {
            this.resizeChart(this.riskChart, this.riskChartParent);
            this.riskChart.render();
            this.riskChart.select("svg").attr("style", "background:white");
        }
        if (this.sexChartOpenCloseAnim === "open") {
            this.resizePieChart(this.sexChart, this.sexChartParent);
            this.sexChart.render();
            this.sexChart.select("svg").attr("style", "background:white");
        }
        if (this.mosaicChartOpenCloseAnim === "open") {
            if (this.mosaicChart === undefined) {
                this.createMosaicChart(this.MDimension, this.MDimGroup);
            }
            this.resizeChart(this.mosaicChart, this.mosaicChartParent);
            this.mosaicChart.render();
            this.mosaicChart.select("svg").attr("style", "background:white");
        }
        if (this.matrixChartOpenCloseAnim === "open") {
            if (this.matrixChart === undefined) {
                this.createMatrixChart(this.MatrixDimension, this.MatrixDimGroup);
            }
            this.resizeHeatChart(this.matrixChart, this.matrixChartParent);
            this.matrixChart.render();
            this.matrixChart.select("svg").attr("style", "background:white");
        }
        if (this.ltcChartOpenCloseAnim === "open") {
            this.resizeChart(this.ltcChart, this.ltcChartParent);
            this.ltcChart.render();
            this.ltcChart.select("svg").attr("style", "background:white");
            this.noSelectedLtcsSelect.render();
        }
        if (this.countltcChartOpenCloseAnim === "open") {
            this.resizeChart(this.countltcChart, this.countltcChartParent);
            this.countltcChart.render();
            this.countltcChart.select("svg").attr("style", "background:white");
        }
        if (this.deprivationChartOpenCloseAnim === "open") {
            this.resizeChart(this.deprivationChart, this.deprivationChartParent);
            this.deprivationChart.render();
            this.deprivationChart.select("svg").attr("style", "background:white");
        }
        if (this.flagChartOpenCloseAnim === "open") {
            this.resizeChart(this.flagChart, this.flagChartParent);
            this.flagChart.render();
            this.flagChart.select("svg").attr("style", "background:white");
            if (this.noSelectedFlagsSelect) {
                this.noSelectedFlagsSelect.render();
            }
        }
        // if (this.countflagChartOpenCloseAnim === "open") {
        //   this.resizeChart(this.countflagChart, this.countflagChartParent);
        //   this.countflagChart.render();
        //   this.countflagChart.select("svg").attr("style", "background:white");
        // }
    }

    /* #region Chart Settings functions */
    createEWMap(dimension: any, group: any) {
        this.ewLoading = false;
        this.ewmapChartDetails = {
            name: "ewChart",
            title: "Electoral Ward",
            dim: dimension,
            group,
            type: "choropleth",
            geojson: this.wards,
            mapOptions: {
                zoom: 8,
                center: {
                    lat: 53.967752,
                    lng: -2.444284,
                },
            },
            featureOptions: {
                weight: 1,
                color: "#7C7C7C",
                opacity: 0.7,
                fillOpacity: 0.4,
            },
            brushOn: true,
            colours: ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
            colorDomain: [0, 8000],
            colorAccessor: (d) => {
                return d.value ? d.value : 0;
            },
            featureKeyAccessor: (feature) => {
                return feature.properties.wd15cd;
            },
            legend: leafletLegend().position("bottomright"),
            popup: (d, feature) => {
                let output = `<h5 class="ttipmap">`;
                output += feature.properties.wd15nm;
                output += `</h5><h5 class="ttipmap">`;
                output += feature.properties.lad15nm;
                output += `</h5><p class="ttipmap">Population: `;
                output += this.numberWithCommas(d.value) + "</p>";
                return output;
            },
            renderPopup: true,
        };
        this.myDC.leafletChoroplethChart = leafletChoroplethChart;
        this.ewChart = this.myDC.leafletChoroplethChart("#" + this.ewmapChartDetails.name);
        this.createChart(this.ewChart, this.ewmapChartDetails, this.ewChartParent);
        this.ewChart.on("preRender", (chart) => {
            chart.colorDomain(d3.extent(chart.data(), chart.valueAccessor()));
        });
        this.ewChart.on("preRedraw", (chart) => {
            chart.colorDomain(d3.extent(chart.data(), chart.valueAccessor()));
        });
        this.ewChart.on("renderlet", () => {
            this.leafletMapRenderedWard = true;
        });
        this.ewChart.on("filtered", () => {
            // this.filterHandled(dimension, filter);
        });
    }
    createGPMap(dimension: any, group: any) {
        // Create map details
        this.gpLoading = false;
        this.gpmapChartDetails = {
            name: "gpBubbleChart",
            title: "GP Practice",
            dim: dimension,
            group,
            type: "markermap",
            mapOptions: {
                zoom: 8,
                center: {
                    lat: 53.967752,
                    lng: -2.444284,
                },
            },
            brushOn: true,
            renderPopup: true,
            circleScale: this.gpCircleScalingFactor,
            locationAccessor: (d) => {
                const gp = this.GPs.features.find((x) => x.properties.Code === d.key);
                if (gp) {
                    return [gp.properties.Lat, gp.properties.Long];
                } else {
                    return [53.967752, -2.444284];
                }
            },
            popup: (d) => {
                const GP = this.GPs.features.filter((x) => x.properties.Code === d.key);
                if (GP.length > 0) {
                    return (
                        `<h5 class="ttipmap">` +
                        GP[0].properties.Name +
                        "</h5>" +
                        `<p class="ttipmap">Total Population: ` +
                        this.numberWithCommas(d.value) +
                        "</p>"
                    );
                } else {
                    return (
                        `<h5 class="ttipmap">` +
                        d.key +
                        `</h5><p class="ttipmap">Total Population: ` +
                        this.numberWithCommas(d.value) +
                        "</p>"
                    );
                }
            },
        };

        // Create bubble map
        const gpBubbleChart = leafletMarkerChartBubble("#" + this.gpmapChartDetails.name);
        this.createChart(gpBubbleChart, this.gpmapChartDetails, this.gpChartParent);
        gpBubbleChart.on("preRedraw", (chart) => {
            chart.circleScale(this.gpCircleScalingFactor);
        });
        gpBubbleChart.on("renderlet", () => {
            this.leafletMapRenderedGP = true;
        });

        // Create marker chart
        this.gpmapChartDetails.name = "gpMarkerChart";
        delete this.gpmapChartDetails.circleScale;
        const gpMarkerChart = dc.leafletMarkerChart("#" + this.gpmapChartDetails.name);
        gpMarkerChart.icon(() => {
            return new L.Icon({
                iconUrl: "/assets/images/marker-icon-violet.png",
            });
        });
        this.createChart(gpMarkerChart, this.gpmapChartDetails, this.gpChartParent);

        // Create map object
        this.gpChart = {
            maps: { bubble: gpBubbleChart, marker: gpMarkerChart },
            render: () => {
                gpBubbleChart.render();
                gpMarkerChart.render();
            },
            redraw: () => {
                gpBubbleChart.redraw();
                gpMarkerChart.redraw();
            },
            circleScale: (scale) => {
                gpBubbleChart.circleScale(scale);
            },
            height: (height) => {
                gpBubbleChart.height(height);
                gpMarkerChart.height(height);
            },
            width: (width) => {
                gpBubbleChart.width(width);
                gpMarkerChart.width(width);
            },
            filterAll: () => {
                gpBubbleChart.filterAll();
                gpMarkerChart.filterAll();
            },
        };
    }

    toggleGpMapChartType() {
        // Toggle map
        this.gpMapShowMarkers = !this.gpMapShowMarkers;
        this.gpChart.redraw();

        // Sync center and zoom
        if (this.gpMapShowMarkers === true) {
            this.gpChart.maps.marker.map().setView(this.gpChart.maps.bubble.map().getCenter(), this.gpChart.maps.bubble.map().getZoom());
        } else {
            this.gpChart.maps.bubble.map().setView(this.gpChart.maps.marker.map().getCenter(), this.gpChart.maps.marker.map().getZoom());
        }
    }

    createAgeChart(dimension: any, group: any) {
        this.ageChartDetails = {
            title: "Age",
            type: "bar",
            dim: dimension,
            group,
            name: "ageChart",
            xUnits: "60",
            elasticY: true,
            round: true,
            alwaysUseRounding: true,
            x: "scaleLinear",
            renderHorizontalGridLines: true,
            xAxisTickFormat: "",
            yAxisTicks: 5,
            gap: 0,
        };
        this.ageChart = this.myDC.barChart("#" + this.ageChartDetails.name);
        this.createChart(this.ageChart, this.ageChartDetails, this.ageChartParent);
    }

    createRiskChart(dimension: any, group: any) {
        this.riskChartDetails = {
            title: "Risk Score",
            type: "bar",
            dim: dimension,
            group,
            name: "riskChart",
            xUnits: "60",
            elasticY: true,
            round: true,
            alwaysUseRounding: true,
            x: "scaleLinear",
            renderHorizontalGridLines: true,
            xAxisTickFormat: "prcnt",
            yAxisTicks: 5,
            gap: 0,
        };
        this.riskChart = this.myDC.barChart("#" + this.riskChartDetails.name);
        this.createChart(this.riskChart, this.riskChartDetails, this.riskChartParent);
    }

    createSexChart(dimension: any, group: any) {
        new Map([
            ["Male", "#E03F8B"],
            ["Female", "#4D75BA"],
            ["Unknown", "#484848"],
        ]);
        this.sexChartDetails = {
            title: "Sex",
            type: "pie",
            dim: dimension,
            group,
            name: "sexChart",
            // ordinalColors: ["#E03F8B", "#4D75BA"],
        };
        this.sexChart = this.myDC.pieChart("#" + this.sexChartDetails.name);
        this.createChart(this.sexChart, this.sexChartDetails, this.sexChartParent);
    }

    createMosaicChart(dimension: any, group: any) {
        this.mosaicChartDetails = {
            title: "Mosaic Type",
            type: "bar",
            dim: dimension,
            group,
            name: "mosaicChart",
            renderLabel: false,
            elasticY: true,
            elasticX: true,
            x: "dim",
            xUnits: "ordinal",
            gap: 0,
            ordering: "descValue",
            yAxisTickFormat: ".3s",
            ordinalColors: MosaicColours,
            colorDomain: MosaicDomain,
            colorAccessor: (d) => {
                return d.key.substr(0, 1);
            },
        };
        this.mosaicChart = this.myDC.barChart("#" + this.mosaicChartDetails.name);
        this.createChart(this.mosaicChart, this.mosaicChartDetails, this.mosaicChartParent);
        this.mosaicChart.on("renderlet", () => {
            const graph = d3
                .select("#" + this.mosaicChartDetails.name)
                .select("svg")
                .selectAll("rect");
            graph
                .on("mouseover.something", (data, index, ar) => this.mosaicMouseEnter(data, index, ar))
                .on("mouseout.something", () => {
                    this.keyToolTip.style("opacity", 0);
                });
        });
    }

    getTooltipHtml(d) {
        const mosaic: MosaicCode = this.mosaicCodes.find((x) => x.code === d);
        return this.tiphtml(d, mosaic);
    }

    mosaicMouseEnter(datum: any, index: number, array: any) {
        const attributes = array[index]["attributes"];
        const x = parseInt(attributes["x"].nodeValue);
        const y = parseInt(attributes["y"].nodeValue);
        const rect = document.getElementById("mosaicChart").getBoundingClientRect();
        const drawer = document.getElementsByClassName("mat-drawer-content")[0];
        this.keyToolTip.transition().duration(200).style("opacity", 0.9);
        this.keyToolTip
            .html(this.getTooltipHtml(datum.x))
            .style("left", x + "px")
            .style("top", drawer.scrollTop + rect.top - y + "px");
    }

    matrixMouseEnter(datum: any, index: number, array: any) {
        const attributes = array[index]["attributes"];
        const x = parseInt(attributes["x"].nodeValue);
        const y = parseInt(attributes["y"].nodeValue);
        const rect = document.getElementById("matrixChart").getBoundingClientRect();
        const drawer = document.getElementsByClassName("mat-drawer-content")[0];
        this.matrixToolTip.transition().duration(200).style("opacity", 0.9);
        this.matrixToolTip
            .html(this.getMatrixTooltipHtml(datum))
            .style("left", x + "px")
            .style("top", drawer.scrollTop + rect.top + y + "px");
    }

    exitMosaic() {
        if (this.keyToolTip) {
            this.keyToolTip.style("opacity", 0);
        }
    }

    exitMatrix() {
        if (this.matrixToolTip) {
            this.matrixToolTip.style("opacity", 0);
        }
    }

    createMatrixChart(dimension: any, group: any) {
        this.matrixChartDetails = {
            title: "COVID Risk Matric",
            type: "heat",
            dim: dimension,
            group,
            name: "matrixChart",
            colorAccessor: (d) => {
                return Math.log(d.value) + 1;
            },
            keyAccessor: (d) => {
                return d.key[0];
            },
            valueAccessor: (d) => {
                return d.key[1];
            },
            colours: ["#2b8cbe", "#4eb3d3", "#7bccc4", "#a8ddb5", "#ccebc5", "#e0f3db", "#f7fcf0"],
            calculateColorDomain: true,
            rowOrdering: (a, b) => {
                const rowA = this.RiskRows.filter((x) => x.name === a)[0].order;
                const rowB = this.RiskRows.filter((x) => x.name === b)[0].order;
                return rowA < rowB ? -1 : rowA > rowB ? 1 : rowA >= rowB ? 0 : NaN;
            },
            colOrdering: (a, b) => {
                const rowA = this.RiskCols.filter((x) => x.name === a)[0].order;
                const rowB = this.RiskCols.filter((x) => x.name === b)[0].order;
                return rowA < rowB ? -1 : rowA > rowB ? 1 : rowA >= rowB ? 0 : NaN;
            },
        };
        this.matrixChart = this.myDC.heatMap("#" + this.matrixChartDetails.name);
        this.createChart(this.matrixChart, this.matrixChartDetails, this.matrixChartParent);
        this.matrixChart.on("renderlet", () => {
            const graph = d3
                .select("#" + this.matrixChartDetails.name)
                .select("svg")
                .selectAll("rect");
            graph
                .on("mouseover.something", (data: any, val, arr) => {
                    const item = this.CareModelExamples.filter((x) => {
                        return x.key[0] === data.key[0] && x.key[1] === data.key[1];
                    });
                    if (item.length > 0) {
                        this.matrixMouseEnter(item[0], val, arr);
                    }
                })
                .on("mouseout.something", () => {
                    this.matrixToolTip.style("opacity", 0);
                });
        });
        this.matrixChart.on("renderlet.label", (chart) => {
            let text = chart
                .selectAll("g.box-group")
                .selectAll("text.annotate")
                .data((d) => [d]);
            text.exit().remove();
            // enter attributes => anything that won't change
            const textEnter = text.enter().append("text").attr("class", "annotate");
            textEnter
                .selectAll("tspan")
                .data((d) => [this.numberWithCommas(d.value)])
                .enter()
                .append("tspan")
                .attr("text-anchor", "middle")
                .attr("dy", 10);
            text = textEnter.merge(text);
            // update attributes => position and text
            text.attr("y", function () {
                const rect = d3.select(this.parentNode).select("rect");
                return +rect.attr("y") + parseInt(rect.attr("height").toString()) / 2 - 15;
            });
            text.selectAll("tspan")
                .attr("x", function () {
                    const rect = d3.select(this.parentNode.parentNode).select("rect");
                    return +rect.attr("x") + parseInt(rect.attr("width").toString()) / 2;
                })
                .text((d) => d);
        });
    }

    createLTCChart(dimension: any, group: any) {
        this.ltcChartDetails = {
            title: "Long-term Conditions",
            containerHeight: "55vh",
            type: "row",
            dim: dimension,
            group,
            name: "ltcChart",
            elasticX: true,
            cap: 20,
            ordering: "descValue",
            xAxisTicks: 3,
        };
        this.ltcChart = this.myDC.rowChart("#" + this.ltcChartDetails.name);
        this.createChart(this.ltcChart, this.ltcChartDetails, this.ltcChartParent);
        this.noSelectedLtcsSelect = this.myDC.selectMenu("#no-selected-ltc-select");
        this.noSelectedLtcsSelect
            .dimension(this.numberSelLtc)
            .group(this.numberSelLtcs)
            .controlsUseVisibility(true)
            .multiple(true)
            .numberVisible(5)
            .filterHandler((dim, filters) => this.filterHandled(dim, filters));
        this.ltcChart.on("filtered", () => {
            if (this.queryFilter["LTCs2Dimension"]) {
                const newSize = this.queryFilter["LTCs2Dimension"].length;
                if (newSize > 5) {
                    this.noSelectedLtcsSelect.numberVisible(newSize);
                } else {
                    this.noSelectedLtcsSelect.numberVisible(5);
                }
            }
            this.noSelectedLtcsSelect.filterAll();
            this.noSelectedLtcsSelect.redraw();
            this.myDC.redrawAll();
            this.ewChart.redraw();
            this.gpChart.redraw();
        });
    }

    createFlagChart(dimension: any, group: any) {
        this.flagChartDetails = {
            title: "Lists",
            containerHeight: "55vh",
            type: "row",
            dim: dimension,
            group,
            name: "flagChart",
            elasticX: true,
            cap: 20,
            ordering: "descValue",
            xAxisTicks: 3,
        };
        this.flagChart = this.myDC.rowChart("#" + this.flagChartDetails.name);
        this.createChart(this.flagChart, this.flagChartDetails, this.flagChartParent);
        this.noSelectedFlagsSelect = this.myDC.selectMenu("#no-selected-flag-select");
        this.noSelectedFlagsSelect
            .dimension(this.numberSelFlag)
            .group(this.numberSelFlags)
            .controlsUseVisibility(true)
            .multiple(true)
            .numberVisible(5)
            .filterHandler((dim, filters) => this.filterHandled(dim, filters));
        this.flagChart.on("filtered", () => {
            if (this.queryFilter["Flags2Dimension"]) {
                const newSize = this.queryFilter["Flags2Dimension"].length;
                if (newSize > 5) {
                    this.noSelectedFlagsSelect.numberVisible(newSize);
                } else {
                    this.noSelectedFlagsSelect.numberVisible(5);
                }
            }
            this.noSelectedFlagsSelect.filterAll();
            this.noSelectedFlagsSelect.redraw();
            this.myDC.redrawAll();
            this.ewChart.redraw();
            this.gpChart.redraw();
        });
    }

    createCountLTCChart(dimension: any, group: any) {
        this.countltcChartDetails = {
            title: "Count of LTCs",
            type: "row",
            dim: dimension,
            group,
            name: "countltcChart",
            renderLabel: true,
            elasticX: true,
            xAxisTicks: 3,
            ordering: "stringKey",
        };
        this.countltcChart = this.myDC.rowChart("#" + this.countltcChartDetails.name);
        this.createChart(this.countltcChart, this.countltcChartDetails, this.countltcChartParent);
    }

    createCountFlagChart(dimension: any, group: any) {
        this.countflagChartDetails = {
            title: "Count of Lists",
            type: "row",
            dim: dimension,
            group,
            name: "countflagChart",
            renderLabel: true,
            elasticX: true,
            xAxisTicks: 3,
            ordering: "stringKey",
        };
        this.countflagChart = this.myDC.rowChart("#" + this.countflagChartDetails.name);
        this.createChart(this.countflagChart, this.countflagChartDetails, this.countflagChartParent);
    }

    createDeprivationChart(dimension: any, group: any) {
        this.deprivationChartDetails = {
            title: "Deprivation Decile",
            type: "row",
            dim: dimension,
            group,
            name: "deprivationChart",
            renderLabel: true,
            elasticX: true,
            cap: 11,
            ordering: "descD",
            xAxisTicks: 3,
            ordinalColors: DeprivationColors,
        };
        this.deprivationChart = this.myDC.rowChart("#" + this.deprivationChartDetails.name);
        this.createChart(this.deprivationChart, this.deprivationChartDetails, this.deprivationChartParent);
    }
    /* #endregion */

    /* #region Chart Sizing Functions */
    gpSliderChanged(event) {
        this.gpCircleScalingFactor = event.value;
        this.gpChart.circleScale(this.gpCircleScalingFactor);
        this.gpChart.redraw();
    }

    onChartCollapse(type) {
        switch (type) {
            case "ewChart":
                this.ewChartOpenCloseAnim = this.ewChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapseMap(this.ewChartOpenCloseAnim, type);
                break;
            case "gpChart":
                this.gpChartOpenCloseAnim = this.gpChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapseMap(this.gpChartOpenCloseAnim, type);
                break;
            case "ageChart":
                this.ageChartOpenCloseAnim = this.ageChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.ageChartOpenCloseAnim, type);
                break;
            case "riskChart":
                this.riskChartOpenCloseAnim = this.riskChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.riskChartOpenCloseAnim, type);
                break;
            case "sexChart":
                this.sexChartOpenCloseAnim = this.sexChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.sexChartOpenCloseAnim, type);
                break;
            case "mosaicChart":
                this.mosaicChartOpenCloseAnim = this.mosaicChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.mosaicChartOpenCloseAnim, type);
                break;
            case "matrixChart":
                this.matrixChartOpenCloseAnim = this.matrixChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.matrixChartOpenCloseAnim, type);
                break;
            case "ltcChart":
                this.ltcChartOpenCloseAnim = this.ltcChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.ltcChartOpenCloseAnim, type);
                if (this.ltcChartOpenCloseAnim === "close") {
                    d3.select("div#no-selected-ltc-select").attr("style", "display:none");
                } else {
                    setTimeout(() => {
                        d3.select("div#no-selected-ltc-select").attr("style", "display:block");
                    }, 600);
                }
                break;
            case "flagChart":
                this.flagChartOpenCloseAnim = this.flagChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.flagChartOpenCloseAnim, type);
                if (this.flagChartOpenCloseAnim === "close") {
                    d3.select("div#no-selected-flag-select").attr("style", "display:none");
                } else {
                    setTimeout(() => {
                        d3.select("div#no-selected-flag-select").attr("style", "display:block");
                    }, 600);
                }
                break;
            case "countltcChart":
                this.countltcChartOpenCloseAnim = this.countltcChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.countltcChartOpenCloseAnim, type);
                break;
            case "countflagChart":
                this.countflagChartOpenCloseAnim = this.countflagChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.countflagChartOpenCloseAnim, type);
                break;
            case "deprivationChart":
                this.deprivationChartOpenCloseAnim = this.deprivationChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.deprivationChartOpenCloseAnim, type);
                break;
            default:
                break;
        }
    }

    collapse(opencloseanim, chartname) {
        if (opencloseanim === "open") {
            setTimeout(() => {
                this.drawCharts();
            }, 500);
        } else {
            d3.select("div#" + chartname + " svg").remove();
        }
    }

    collapseMap(opencloseanim, chartname) {
        if (opencloseanim === "open") {
            setTimeout(() => {
                d3.select("div#" + chartname).attr("style", "display:block");
            }, 500);
        } else {
            d3.select("div#" + chartname).attr("style", "display:none");
        }
    }

    resizeChart(chart, parent) {
        if (chart) {
            chart.height(parent.nativeElement.clientHeight - 20);
            chart.width(parent.nativeElement.clientWidth - 50);
        }
    }

    resizeHeatChart(chart, parent) {
        if (chart) {
            chart.height(parent.nativeElement.clientHeight - 20);
            chart.width(parent.nativeElement.clientWidth - 100);
        }
    }

    resizePieChart(chart, parent) {
        const width = Math.floor(parent.nativeElement.clientWidth * 0.85);
        const height = parent.nativeElement.clientHeight - 55;
        if (width < height) {
            chart.height(width);
            chart.width(width);
        } else {
            chart.height(height);
            chart.width(height);
        }
    }
    /* #endregion */

    createChart(chart, details, parent) {
        chart.dimension(details.dim).group(details.group);

        if (details.type !== "pie" && details.type !== "choropleth" && details.type !== "markermap") {
            chart.margins({
                top: 20,
                right: 10,
                bottom: 30,
                left: 50,
            });
        }
        if (details.type === "choropleth") {
            chart.geojson(details.geojson);
        }
        if (details.locationAccessor) {
            chart.locationAccessor(details.locationAccessor);
        }
        if (details.circleScale) {
            chart.circleScale(details.circleScale);
        }
        if (details.mapOptions) {
            chart.mapOptions(details.mapOptions);
        }
        if (details.featureOptions) {
            chart.featureOptions(details.featureOptions);
        }
        if (details.brushOn !== undefined) {
            chart.brushOn(details.brushOn);
        }
        if (details.colours) {
            chart.colors(details.colours);
        }
        if (details.colorDomain) {
            chart.colorDomain(details.colorDomain);
        }
        if (details.featureKeyAccessor) {
            chart.featureKeyAccessor(details.featureKeyAccessor);
        }
        if (details.legend) {
            chart.legend(details.legend);
        }
        if (details.renderPopup !== undefined) {
            chart.renderPopup(true);
        }
        if (details.popup) {
            chart.popup(details.popup);
        }
        if (parent && parent.nativeElement.clientHeight) {
            if (details.type === "pie") {
                this.resizePieChart(chart, parent);
            } else if (details.type === "heat") {
                this.resizeHeatChart(chart, parent);
            } else {
                this.resizeChart(chart, parent);
            }
        }
        if (details.renderLabel) {
            chart.renderLabel(details.renderLabel);
        }
        if (details.ordinalColors) {
            chart.ordinalColors(details.ordinalColors);
        }
        if (details.xUnits) {
            switch (details.xUnits) {
                case "ordinal":
                    chart.xUnits(this.myDC.units.ordinal);
                    break;
                default:
                    chart.xUnits(() => {
                        return details.xUnits;
                    });
            }
        }
        if (details.elasticY) {
            chart.elasticY(details.elasticY);
        }
        if (details.elasticX) {
            chart.elasticX(details.elasticX);
        }
        if (details.round) {
            chart.round(this.myDC.round.floor);
        }
        if (details.alwaysUseRounding) {
            chart.alwaysUseRounding(details.alwaysUseRounding);
        }
        if (details.x) {
            switch (details.x) {
                case "dim":
                    chart.x(d3.scaleOrdinal().domain(details.dim));
                    break;
                default:
                    chart.x(d3.scaleLinear().domain([0, 100]));
                    break;
            }
        }
        if (details.xAxisTicks) {
            chart.xAxis().ticks(details.xAxisTicks);
        }
        if (details.xAxisTickFormat) {
            switch (details.xAxisTickFormat) {
                case "prcnt":
                    chart.xAxis().tickFormat((v) => {
                        return v + "%";
                    });
                    break;
                default:
                    chart.xAxis().tickFormat((v) => {
                        return v + "";
                    });
                    break;
            }
        }
        if (details.yAxisTicks) {
            chart.yAxis().ticks(details.yAxisTicks);
        }
        if (details.yAxisTickFormat) {
            switch (details.xAxisTickFormat) {
                default:
                    chart.yAxis().tickFormat(d3.format(details.yAxisTickFormat));
                    break;
            }
        }
        if (details.gap) {
            chart.gap(details.gap);
        }
        if (details.renderHorizontalGridLines) {
            chart.renderHorizontalGridLines(details.renderHorizontalGridLines);
        }
        if (details.ordering) {
            switch (details.ordering) {
                case "descD":
                    chart.ordering((d) => {
                        return -d.d;
                    });
                    break;
                case "descValue":
                    chart.ordering((d) => {
                        return -d.value;
                    });
                    break;
                default:
                    chart.ordering((d) => {
                        return String(d.key);
                    });
                    break;
            }
        }
        if (details.ordinalColors) {
            chart.ordinalColors(details.ordinalColors);
        }
        if (details.colorDomain) {
            chart.colorDomain(details.colorDomain);
        }
        if (details.colorAccessor) {
            chart.colorAccessor(details.colorAccessor);
        }
        if (details.valueAccessor) {
            chart.valueAccessor(details.valueAccessor);
        }
        if (details.keyAccessor) {
            chart.keyAccessor(details.keyAccessor);
        }
        if (details.cap) {
            chart.cap(details.cap);
        }
        if (details.calculateColorDomain) {
            chart.calculateColorDomain();
        }
        if (details.colOrdering) {
            chart.colOrdering(details.colOrdering);
        }
        if (details.rowOrdering) {
            chart.rowOrdering(details.rowOrdering);
        }
        chart.filterHandler((dim, filters) => this.filterHandled(dim, filters));
        chart.commitHandler(async () => {
            await this.refresh(this.queryFilter);
        });
    }

    tiphtml(d, mosaic) {
        const usedMosaicType = d;
        let output = "";
        output = "	<div id='mosaicToolTip' class='container d3-tip mosaic-" + usedMosaicType.substr(0, 1) + "'>";
        output += "		<div fxLayout='row wrap'>";
        output += "			<div>";
        output += "<h2>" + usedMosaicType + "</h2>";
        output += "			</div>";
        output += "			<div>";
        output += "<h5>" + mosaic.name + "</h5>";
        output += "			</div>";
        output += "		</div>";
        output += "			<div fxLayout='row wrap'>";
        output += "		<div fxFlex.gt-sm='100' fxFlex.gt-xs='100' fxFlex='100'>";
        output += "<h6>" + mosaic.desc + "</h6>";
        output += "			</div>";
        output += "		</div>";
        output += "			<div fxLayout='row wrap'>";
        output += "		<div fxFlex.gt-sm='100' fxFlex.gt-xs='100' fxFlex='100'>";
        output += `<img alt="image" class="img-container" src="assets/images/mosaic/mosaic_' + usedMosaicType + '.jpg">`;
        output += "			</div>";
        output += "		</div>";
        output += "			<div fxLayout='row wrap'>";
        output += "		<div fxFlex.gt-sm='100' fxFlex.gt-xs='100' fxFlex='100'>";
        output += "<ul>";
        output += "<li>" + mosaic.Feat1 + "</li >";
        output += "<li>" + mosaic.Feat2 + "</li >";
        output += "<li>" + mosaic.Feat3 + "</li >";
        output += "<li>" + mosaic.Feat4 + "</li >";
        output += "<li>" + mosaic.Feat5 + "</li >";
        output += "<li>" + mosaic.Feat6 + "</li >";
        output += "<ul>";
        output += "			</div>";
        output += "		</div>";
        output += "	</div>";
        return output;
    }

    getMatrixTooltipHtml(d) {
        let output = "";
        output = "	<div id='matrixToolTip' class='container d3-tip bg-" + (d.color || "info") + "'>";
        output += "		<div fxLayout='row wrap'>";
        output += "			<div>";
        output += "<h4>" + JSON.stringify(d.key).replace("[", "").replace("]", "").replace(",", " and ") + "</h4>";
        output += "			</div>";
        output += "			<div>";
        output += "<h5>Care Model Example Interventions</h5>";
        output += "			</div>";
        output += "		</div>";
        output += "			<div fxLayout='row wrap'>";
        output += "		<div fxFlex.gt-sm='100' fxFlex.gt-xs='100' fxFlex='100'>";
        output += "<ul style='font-size:14px; text-align: initial'>";
        d.interventions.forEach((element) => {
            output += "<li>" + element + "</li >";
        });
        output += "<ul>";
        output += "			</div>";
        output += "		</div>";
        output += "	</div>";
        return output;
    }

    async cohortChanged(event) {
        if (event === null || event.cohorturl.toString().length < 3) {
            this.queryFilter = {};
            this.myDC.filterAll(null);
            this.resetToWholePop();
            return;
        }
        const cohorturl = event.cohorturl;
        const cohortJSON = JSON.parse(event.cohorturl);
        const list = this.myDC.chartRegistry.list();
        list.forEach((e) => {
            const chart = list[e];
            const theFilter = cohortJSON[this.convertChartToDim(chart.anchorName())];
            if (theFilter !== undefined) {
                let usedFilterArray = [];
                if (typeof theFilter[0] === "object" && chart.anchorName() !== "ltcChart" && chart.anchorName() !== "flagChart") {
                    usedFilterArray = [theFilter[0][0], theFilter[0][1]];
                } else {
                    usedFilterArray = [theFilter];
                }
                chart.filter(usedFilterArray);
            } else {
                chart.filter(null);
            }
        });
        const header = [["Authorization", "JWT " + this.store.selectSnapshot(AuthState.getToken)]];
        const options: RequestInit = {
            method: "GET",
            headers: header,
        };
        await d3
            .json(
                this.origin.replace("cvi", "pmi") + "/populations/getCrossfilter?filter=" + cohorturl,
                options
                // {
                //   headers: new Headers({ Authorization: "JWT " + this.token })
                // }
            )
            .then((d) => {
                if (this.filteredData !== d) {
                    this.filteredData = d;
                    this.myDC.redrawAll();
                    this.ewChart.redraw();
                    this.gpChart.redraw();
                    this.ccgSelect.redraw();
                    this.icpSelect.redraw();
                    this.neighbourhoodSelect.redraw();
                    this.queryFilter = JSON.parse(cohorturl);
                    this.loadFilters = {};
                    this.loading = false;
                }
            });
    }

    getDimensionFromName(name: string): any {
        const strippedName = name.replace(`"`, "").replace(`"`, "");
        switch (strippedName) {
            case "numberSelFlags":
                return this.numberSelFlags;
            case "FCntDimension":
                return this.FCntDimension;
            case "Flags2Dimension":
                return this.Flags2Dimension;
            case "FlagsDimension":
                return this.FlagsDimension;
            case "numberSelLtcs":
                return this.numberSelLtcs;
            case "CCGDimension":
                return this.CCGDimension;
            case "ICPDimension":
                return this.ICPDimension;
            case "MDimension":
                return this.MDimension;
            case "MatrixDimension":
                return this.MatrixDimension;
            case "WDimension":
                return this.WDimension;
            case "UDimension":
                return this.UDimension;
            case "GPDimension":
                return this.GPDimension;
            case "LCntDimension":
                return this.LCntDimension;
            case "LTCs2Dimension":
                return this.LTCs2Dimension;
            case "LTCsDimension":
                return this.LTCsDimension;
            case "RskDimension":
                return this.RskDimension;
            case "SexDimension":
                return this.SexDimension;
            case "DDimension":
                return this.DDimension;
            case "LDimension":
                return this.LDimension;
            case "AgeDimension":
                return this.AgeDimension;
            default:
                return this.AgeDimension;
        }
    }

    convertChartToDim(chartname) {
        switch (chartname) {
            case "flagChart":
                return "Flags2Dimension";
            case "countflagChart":
                return "FCntDimension";
            case "sexChart":
                return "SexDimension";
            case "ageChart":
                return "AgeDimension";
            case "riskChart":
                return "RskDimension";
            case "ltcChart":
                return "LTCs2Dimension";
            case "countltcChart":
                return "LCntDimension";
            case "no-selected-ltc-select":
                return "numberSelLtc";
            case "no-selected-flag-select":
                return "numberSelFlag";
            case "deprivationChart":
                return "DDimension";
            case "ccg-select":
                return "CCGDimension";
            case "icp-select":
                return "ICPDimension";
            case "neighbourhood-select":
                return "LDimension";
            case "mosaicChart":
                return "MDimension";
            case "matrixChart":
                return "MatrixDimension";
            case "ewChart":
                return "WDimension";
            case "gpChart":
                return "GPDimension";
            default:
                return "";
        }
    }

    /* #region Filter Display Functions */
    showRange(text) {
        this.dialog.open(ExpandTextDialogComponent, {
            width: "350px",
            data: text,
        });
    }

    shortenText(text: string): string {
        if (text.length > 25) {
            return text.substr(0, 22) + "...";
        }
        return text;
    }
    /* #endregion */

    showGuide() {
        this.joyrideService.startTour({
            steps: ["cvi0", "cvi1", "cvi2", "cvi3", "cvi4", "cvi5", "cvi6", "cvi7", "cvi8"],
        });
    }
}

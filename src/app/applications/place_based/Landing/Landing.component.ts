import { Component, OnInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import * as dc from "dc";
import * as d3 from "d3";
import { Store } from "@ngxs/store";
import { latLng, tileLayer } from "leaflet";
import * as L from "leaflet";
import { CategoryColors } from "./incidentLegend/colorlist";
import { collapseAnimations } from "src/app/shared/animations";
import { colorbrewer, DeprivationColors } from "src/app/_models/chart_colour_ranges";
import { MatDialog } from "@angular/material/dialog";
import { AuthState } from "src/app/_states/auth.state";
import { BarChart } from "src/app/_models/chart";
import { StatCardData } from "src/app/_models/SPI_Lookups";
import { MosaicColours, MosaicDomain } from "src/app/_models/mosaiccode";
import { StorageService } from "src/app/_services/storage.service";
import { APIService } from "diu-component-library";
import { MapData } from "../../../shared/map.component";
import { ExpandTextDialogComponent } from "../../covid_intelligence/_modals/dialogexpand";
import { environment } from "src/environments/environment";
declare let window: any;

@Component({
    selector: "app-Landing",
    templateUrl: "./Landing.component.html",
    animations: [collapseAnimations],
})
export class LandingComponent implements OnInit {
    resetBtnPushed = false;
    loadFilters = {};
    dataLoaded = false;
    TotalPopulation: any;
    incidentsCount: any;
    all: any;
    ndx: any;
    myDC: any;
    filteredData: any;
    totalsize: number;
    queryFilter: any = {};
    lastQueryFilter: any = {};
    token: any;
    origin: any;
    selectedPopulation = 0;

    @ViewChild("methodsChartParent", { static: false }) methodsChartParent: ElementRef;
    @ViewChild("inquestconclusionChartParent", { static: false }) inquestconclusionChartParent: ElementRef;
    @ViewChild("type_of_locationsChartParent", { static: false }) type_of_locationsChartParent: ElementRef;
    @ViewChild("typesChartParent", { static: false }) typesChartParent: ElementRef;
    @ViewChild("csp_districtsChartParent", { static: false }) csp_districtsChartParent: ElementRef;
    @ViewChild("coroner_areasChartParent", { static: false }) coroner_areasChartParent: ElementRef;
    @ViewChild("local_authoritysChartParent", { static: false }) local_authoritysChartParent: ElementRef;
    @ViewChild("reported_bysChartParent", { static: false }) reported_bysChartParent: ElementRef;
    @ViewChild("bereavement_offeredsChartParent", { static: false }) bereavement_offeredsChartParent: ElementRef;
    @ViewChild("imd_decilesChartParent", { static: false }) imd_decilesChartParent: ElementRef;
    @ViewChild("employmentsChartParent", { static: false }) employmentsChartParent: ElementRef;
    @ViewChild("gendersChartParent", { static: false }) gendersChartParent: ElementRef;
    @ViewChild("rts_accuratesChartParent", { static: false }) rts_accuratesChartParent: ElementRef;
    @ViewChild("agesChartParent", { static: false }) agesChartParent: ElementRef;
    @ViewChild("day_of_the_weeksChartParent", { static: false }) day_of_the_weeksChartParent: ElementRef;
    @ViewChild("monthsChartParent", { static: false }) monthsChartParent: ElementRef;
    @ViewChild("datesChartParent", { static: false }) datesChartParent: ElementRef;
    @ViewChild("inquest_datesChartParent", { static: false }) inquest_datesChartParent: ElementRef;
    @ViewChild("mh_services_lscft_updatesChartParent", { static: false }) mh_services_lscft_updatesChartParent: ElementRef;
    @ViewChild("dasChartParent", { static: false }) dasChartParent: ElementRef;
    @ViewChild("asc_lcc_updatesChartParent", { static: false }) asc_lcc_updatesChartParent: ElementRef;
    ics: any;
    ics_group: any;
    icsSelect: dc.SelectMenu;
    bcu: any;
    bcu_group: any;
    bcuSelect: dc.SelectMenu;
    ccg: any;
    ccg_group: any;
    ccgSelect: dc.SelectMenu;
    lancs12: any;
    lancs12_group: any;
    lancs12Select: dc.SelectMenu;
    type: any;
    type_group: any;
    typeSelect: dc.SelectMenu;
    TotalSelected: any;
    PercentSelected: any;
    patientsCount: any;
    mapHeight = { height: "50vh" };
    mapStyle = { display: "block" };
    mapRender = false;
    MapCenter = latLng(53.838759, -2.909497);
    blnShowMap = false;
    MapZoom = 5;
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
            zoom: 9,
            center: latLng(53.838759, -2.909497),
        },
        layers: [],
    };
    postcodeMosaic: any;
    postcodeMosaicTypeDimGroup: any;
    @ViewChild("mosaicChartParent", { static: false }) mosaicChartParent: ElementRef;

    totalIncidents: StatCardData = {
        title: "Incidents",
        value: "TotalIncidents",
        icon: "group",
        color: "bg-warning",
    };
    selectedPop: StatCardData = {
        title: "Selected Incidents",
        value: "TotalSelected",
        icon: "assignment_turned_in",
        color: "bg-success",
    };
    selected: StatCardData = {
        title: "% SELECTED",
        value: "PercentSelected",
        icon: "assessment",
        color: "bg-primary",
    };
    subd = "";
    mode = false;
    mapLegend: any[] = [];
    mosaicCodes: any[];
    mosaicChart: any;
    mosaicChartDetails: BarChart;
    mosaicChartOpenCloseAnim = "open";
    keyToolTip: any;
    openCloseAnimation = {};
    averageAge: any;
    crossFilterData = {
        postcodeMosaic: {
            type: "regular",
            dimgroup: "postcodeMosaicTypeDimGroup",
            filterName: "postcode_mosaic",
        },
        method: {
            type: "regular",
            dimgroup: "MethodsDimGroup",
            filterName: "method",
            chartData: {
                title: "Methods",
                type: "row",
                name: "methodsChart",
                renderLabel: true,
                elasticX: true,
                xAxisTicks: 3,
                ordering: "stringKey",
                ordinalColors: colorbrewer,
            },
            openCloseAnim: "open",
            parent: "methodsChartParent",
        },
        inquest_conclusion: {
            type: "regular",
            dimgroup: "inquestconclusionDimGroup",
            filterName: "inquest_conclusion",
            chartData: {
                title: "Inquest Conclusions",
                type: "row",
                name: "inquestconclusionChart",
                renderLabel: true,
                elasticX: true,
                xAxisTicks: 3,
                ordering: "stringKey",
                ordinalColors: colorbrewer,
            },
            openCloseAnim: "open",
            parent: "inquestconclusionChartParent",
        },
        mh_services_lscft_update: {
            type: "regular",
            dimgroup: "mh_services_lscft_updateDimGroup",
            filterName: "mh_services_lscft_update",
            chartData: {
                title: "LSCFT Mental Health Services",
                type: "row",
                name: "mh_services_lscft_updatesChart",
                renderLabel: true,
                elasticX: true,
                xAxisTicks: 3,
                ordering: "stringKey",
                ordinalColors: colorbrewer,
            },
            openCloseAnim: "open",
            parent: "mh_services_lscft_updatesChartParent",
        },
        da: {
            type: "regular",
            dimgroup: "daDimGroup",
            filterName: "da",
            chartData: {
                title: "Domestic Abuse",
                type: "row",
                name: "dasChart",
                renderLabel: true,
                elasticX: true,
                xAxisTicks: 3,
                ordering: "stringKey",
                ordinalColors: colorbrewer,
            },
            openCloseAnim: "open",
            parent: "dasChartParent",
        },
        asc_lcc_update: {
            type: "regular",
            dimgroup: "asc_lcc_updateDimGroup",
            filterName: "asc_lcc_update",
            chartData: {
                title: "Adult Social Care",
                type: "row",
                name: "asc_lcc_updatesChart",
                renderLabel: true,
                elasticX: true,
                xAxisTicks: 3,
                ordering: "stringKey",
                ordinalColors: colorbrewer,
            },
            openCloseAnim: "open",
            parent: "asc_lcc_updatesChartParent",
        },
        type_of_location: {
            type: "regular",
            dimgroup: "Type_of_locationsDimGroup",
            filterName: "type_of_location",
            chartData: {
                title: "Type_of_locations",
                type: "row",
                name: "type_of_locationsChart",
                renderLabel: true,
                elasticX: true,
                xAxisTicks: 3,
                ordering: "stringKey",
                ordinalColors: colorbrewer,
            },
            openCloseAnim: "open",
            parent: "type_of_locationsChartParent",
        },
        csp_district: {
            type: "regular",
            dimgroup: "csp_districtsDimGroup",
            filterName: "csp_district",
            chartData: {
                title: "csp_districts",
                type: "row",
                name: "csp_districtsChart",
                renderLabel: true,
                elasticX: true,
                xAxisTicks: 3,
                ordering: "stringKey",
                ordinalColors: colorbrewer,
            },
            openCloseAnim: "open",
            parent: "csp_districtsChartParent",
        },
        coroner_area: {
            type: "regular",
            dimgroup: "Coroner_areasDimGroup",
            filterName: "coroner_area",
            chartData: {
                title: "Coroner_areas",
                type: "row",
                name: "coroner_areasChart",
                renderLabel: true,
                elasticX: true,
                xAxisTicks: 3,
                ordering: "stringKey",
                ordinalColors: colorbrewer,
            },
            openCloseAnim: "open",
            parent: "coroner_areasChartParent",
        },
        local_authority: {
            type: "regular",
            dimgroup: "Local_authoritysDimGroup",
            filterName: "local_authority",
            chartData: {
                title: "Local_authoritys",
                type: "row",
                name: "local_authoritysChart",
                renderLabel: true,
                elasticX: true,
                xAxisTicks: 3,
                ordering: "stringKey",
                ordinalColors: colorbrewer,
            },
            openCloseAnim: "open",
            parent: "local_authoritysChartParent",
        },
        employment: {
            type: "regular",
            dimgroup: "EmploymentsDimGroup",
            filterName: "employment",
            chartData: {
                title: "Employments",
                type: "row",
                name: "employmentsChart",
                renderLabel: true,
                elasticX: true,
                xAxisTicks: 3,
                ordering: "stringKey",
                ordinalColors: colorbrewer,
            },
            openCloseAnim: "open",
            parent: "employmentsChartParent",
        },
        reported_by: {
            type: "regular",
            dimgroup: "Reported_bysDimGroup",
            filterName: "reported_by",
            chartData: {
                title: "Reported_bys",
                type: "row",
                name: "reported_bysChart",
                renderLabel: true,
                elasticX: true,
                xAxisTicks: 3,
                ordering: "stringKey",
                ordinalColors: colorbrewer,
            },
            openCloseAnim: "open",
            parent: "reported_bysChartParent",
        },
        bereavement_offered: {
            type: "regular",
            dimgroup: "Bereavement_offeredsDimGroup",
            filterName: "bereavement_offered",
            chartData: {
                title: "Bereavement_offereds",
                type: "row",
                name: "bereavement_offeredsChart",
                renderLabel: true,
                elasticX: true,
                xAxisTicks: 3,
                ordering: "stringKey",
                ordinalColors: colorbrewer,
            },
            openCloseAnim: "open",
            parent: "bereavement_offeredsChartParent",
        },
        imd_decile: {
            type: "regular",
            dimgroup: "Imd_decilesDimGroup",
            filterName: "imd_decile",
            chartData: {
                title: "Imd_deciles",
                type: "row",
                name: "imd_decilesChart",
                renderLabel: true,
                elasticX: true,
                ordering: "custom",
                customOrder: {
                    Unknown: 0,
                    1: 1,
                    2: 2,
                    3: 3,
                    4: 4,
                    5: 5,
                    6: 6,
                    7: 7,
                    8: 8,
                    9: 9,
                    10: 10,
                },
                xAxisTicks: 3,
                ordinalColors: DeprivationColors,
            },
            openCloseAnim: "open",
            parent: "imd_decilesChartParent",
        },
        gender: {
            type: "regular",
            dimgroup: "GendersDimGroup",
            filterName: "gender",
            chartData: {
                title: "Genders",
                type: "pie",
                name: "gendersChart",
                ordinalColors: ["#4D75BA", "#E03F8B", "#808080", "#2b8cbe"],
            },
            openCloseAnim: "open",
            parent: "gendersChartParent",
        },
        rts_accurate: {
            type: "regular",
            dimgroup: "Rts_accuratesDimGroup",
            filterName: "rts_accurate",
            chartData: {
                title: "Rts_accurates",
                type: "pie",
                name: "rts_accuratesChart",
                ordinalColors: colorbrewer,
            },
            openCloseAnim: "open",
            parent: "rts_accuratesChartParent",
        },
        age: {
            type: "regular",
            dimgroup: "AgesDimGroup",
            filterName: "age",
            chartData: {
                title: "Ages",
                type: "bar",
                name: "agesChart",
                elasticY: true,
                round: true,
                alwaysUseRounding: true,
                x: "scaleLinear",
                renderHorizontalGridLines: true,
                xAxisTickFormat: "",
                yAxisTicks: 5,
                gap: 0,
            },
            openCloseAnim: "open",
            parent: "agesChartParent",
        },
        day_of_the_week: {
            type: "regular",
            dimgroup: "Day_of_the_weekDimGroup",
            filterName: "day_of_the_week",
            chartData: {
                title: "Day_of_the_week",
                type: "bar",
                name: "day_of_the_weeksChart",
                renderLabel: false,
                elasticY: true,
                elasticX: true,
                x: "dim",
                xUnits: "ordinal",
                gap: 0,
                ordering: "descValue",
                yAxisTickFormat: ".3s",
                ordinalColors: colorbrewer,
                colorAccessor: (d) => {
                    return d.key.substr(0, 1);
                },
            },
            openCloseAnim: "open",
            parent: "day_of_the_weeksChartParent",
        },
        month: {
            type: "regular",
            dimgroup: "monthsDimGroup",
            filterName: "month",
            chartData: {
                title: "Month",
                type: "bar",
                name: "monthsChart",
                renderLabel: false,
                elasticY: true,
                elasticX: true,
                x: "dim",
                xUnits: "ordinal",
                gap: 0,
                ordering: "descValue",
                yAxisTickFormat: ".3s",
                ordinalColors: colorbrewer,
                colorAccessor: (d) => {
                    return d.key.substr(0, 1);
                },
            },
            openCloseAnim: "open",
            parent: "monthsChartParent",
        },
        date: {
            type: "date",
            dimgroup: "DatesDimGroup",
            filterName: "date",
            chartData: {
                title: "Dates",
                type: "bar",
                name: "datesChart",
                elasticY: true,
                centerBar: true,
                x: "time",
                xstart: new Date(2019, 1, 1),
                xend: new Date(),
                round: "timeDay",
                alwaysUseRounding: true,
                xAxis: true,
                xAxisTicks: d3.timeMonth.every(1),
                timeticks: "timeWeek",
                timeformat: "%d %b",
                gap: 1,
            },
            openCloseAnim: "open",
            parent: "datesChartParent",
        },
        inquest_date: {
            type: "date",
            dimgroup: "Inquest_datesDimGroup",
            filterName: "inquest_date",
            chartData: {
                title: "Inquest_date",
                type: "bar",
                name: "inquest_datesChart",
                elasticY: true,
                centerBar: true,
                x: "time",
                xstart: new Date(2019, 1, 1),
                xend: new Date(),
                round: "timeDay",
                alwaysUseRounding: true,
                xAxis: true,
                xAxisTicks: d3.timeMonth.every(1),
                timeticks: "timeWeek",
                timeformat: "%d %b",
                gap: 1,
            },
            openCloseAnim: "open",
            parent: "inquest_datesChartParent",
        },
        ics: {
            type: "regular",
            dimgroup: "ics_group",
            filterName: "ics",
        },
        bcu: {
            type: "regular",
            dimgroup: "bcu_group",
            filterName: "bcu",
        },
        ccg: {
            type: "regular",
            dimgroup: "ccg_group",
            filterName: "ccg",
        },
        lancs12: {
            type: "regular",
            dimgroup: "lancs12_group",
            filterName: "lancs12",
        },
        type: {
            type: "regular",
            dimgroup: "type_group",
            filterName: "type",
        },
    };

    @HostListener("window:resize", ["$event"])
    onResize() {
        setTimeout(() => {
            this.drawCharts();
        }, 0);
    }

    constructor(
        public store: Store,
        private storageService: StorageService,
        public dialog: MatDialog,
        private referenceService: APIService
    ) {
        this.token = this.store.selectSnapshot(AuthState.getToken);
        const parsedUrl = window.location.href;
        this.origin = parsedUrl.replace("/main", "");
        if (this.origin.includes("localhost")) {
            this.origin = "https://www." + environment.websiteURL;
        }
        const origin = window.location.origin;
        if (origin.includes("localhost")) {
            this.subd = ".dev";
        }
        this.referenceService.getMosiacs().subscribe((res: any[]) => {
            this.mosaicCodes = res;
        });
        this.keyToolTip = d3.select("mat-sidenav-content").append("div").attr("class", "tooltip").style("opacity", 0);
    }

    ngOnInit() {
        this.buildCF();
    }

    buildCF() {
        this.myDC = dc;
        Object.keys(this.crossFilterData).forEach((key) => {
            if (this.crossFilterData[key].openCloseAnim) {
                this.openCloseAnimation[this.crossFilterData[key].filterName] = "open";
            }
        });
        this.storageService.getCrossfilter("{}").subscribe((res: any) => {
            this.dataLoaded = true;
            this.filteredData = res;
            this.totalsize = this.filteredData["all"].values;
            this.buildCFServer();
            setTimeout(() => {
                this.createCharts();
                this.drawCharts();
                this.blnShowMap = true;
            }, 1000);
        });
    }

    createCharts() {
        Object.keys(this.crossFilterData).forEach((key) => {
            if (this.crossFilterData[key].chartData) {
                this.crossFilterData[key].chartData.dim = this[key];
                this.crossFilterData[key].chartData.group = this[this.crossFilterData[key].dimgroup];
                switch (this.crossFilterData[key].chartData.type) {
                    case "pie":
                        this.crossFilterData[key].chart = this.myDC.pieChart("#" + this.crossFilterData[key].chartData.name);
                        break;
                    case "bar":
                        this.crossFilterData[key].chart = this.myDC.barChart("#" + this.crossFilterData[key].chartData.name);
                        break;
                    case "row":
                    default:
                        this.crossFilterData[key].chart = this.myDC.rowChart("#" + this.crossFilterData[key].chartData.name);
                        break;
                }
                this.createChart(
                    this.crossFilterData[key].chart,
                    this.crossFilterData[key].chartData,
                    this[this.crossFilterData[key].parent]
                );
            }
        });

        this.icsSelect = this.myDC.selectMenu("#ics-select");
        this.icsSelect.dimension(this.ics).group(this.ics_group).controlsUseVisibility(true);
        this.icsSelect.filterHandler((dim, filters) => this.filterHandled(dim, filters));

        this.bcuSelect = this.myDC.selectMenu("#bcu-select");
        this.bcuSelect.dimension(this.bcu).group(this.bcu_group).controlsUseVisibility(true);
        this.bcuSelect.filterHandler((dim, filters) => this.filterHandled(dim, filters));

        this.ccgSelect = this.myDC.selectMenu("#ccg-select");
        this.ccgSelect.dimension(this.ccg).group(this.ccg_group).controlsUseVisibility(true);
        this.ccgSelect.filterHandler((dim, filters) => this.filterHandled(dim, filters));

        this.lancs12Select = this.myDC.selectMenu("#lancs12-select");
        this.lancs12Select.dimension(this.lancs12).group(this.lancs12_group).controlsUseVisibility(true);
        this.lancs12Select.filterHandler((dim, filters) => this.filterHandled(dim, filters));

        this.typeSelect = this.myDC.selectMenu("#type-select");
        this.typeSelect.dimension(this.type).group(this.type_group).controlsUseVisibility(true);
        this.typeSelect.filterHandler((dim, filters) => this.filterHandled(dim, filters));

        if (this.mosaicChartOpenCloseAnim === "open") {
            this.createMosaicChart(this.postcodeMosaic, this.postcodeMosaicTypeDimGroup);
        }
    }

    drawCharts() {
        if (this.icsSelect) {
            this.icsSelect.render();
        }
        if (this.bcuSelect) {
            this.bcuSelect.render();
        }
        if (this.ccgSelect) {
            this.ccgSelect.render();
        }
        if (this.lancs12Select) {
            this.lancs12Select.render();
        }
        if (this.typeSelect) {
            this.typeSelect.render();
        }
        this.incidentsCount = this.myDC.numberDisplay("#TotalIncidents");
        this.incidentsCount
            .dimension(this.ndx)
            .group(this.all)
            .formatNumber(() => {
                const total = this.incidentsCount.dimension().size();
                return this.numberWithCommas(total);
            });
        Object.keys(this.crossFilterData).forEach((key) => {
            if (this.crossFilterData[key].chartData) {
                if (this.openCloseAnimation[this.crossFilterData[key].filterName] === "open") {
                    this.resizeChart(this.crossFilterData[key].chart, this[this.crossFilterData[key].parent]);
                    if (this.crossFilterData[key].chart) {
                        this.crossFilterData[key].chart.render();
                        this.crossFilterData[key].chart.select("svg").attr("style", "background:white");
                    }
                }
            }
        });
        if (this.mosaicChartOpenCloseAnim === "open") {
            if (this.mosaicChart === undefined) {
                this.createMosaicChart(this.postcodeMosaic, this.postcodeMosaicTypeDimGroup);
            }
            this.resizeChart(this.mosaicChart, this.mosaicChartParent);
            this.mosaicChart.render();
            this.mosaicChart.select("svg").attr("style", "background:white");
        }
        this.drawMap();
        this.updateSummaries();
        this.myDC.redrawAll();
    }

    drawMap() {
        this.MapData.layers = [];
        let name = "incident_location";
        this.mode ? (name = "residence_location") : (name = "incident_location");
        const newMarkers = new L.LayerGroup();
        this.mapLegend = [];
        this.filteredData[name].values.forEach((element) => {
            if (element.key !== "Unknown" && element.value !== 0) {
                const newKey = this.unflattenLocation(element.key);
                const type = this.getIconType(newKey);
                let blnFoundLegend = false;
                this.mapLegend.forEach((item) => {
                    if (item.displayName === type.displayName) {
                        blnFoundLegend = true;
                        item.total++;
                    }
                });
                if (!blnFoundLegend) {
                    this.mapLegend.push({ displayName: type.displayName, total: element.value });
                }
                L.marker(
                    {
                        lat: newKey.latitude,
                        lng: newKey.longitude,
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
                ).addTo(newMarkers);
            }
        });
        this.MapData.layers.push(newMarkers);
    }

    unflattenLocation(location) {
        const newObject = { postcode: null, latitude: null, longitude: null, method: "", type: "" };
        if (location.includes("|")) {
            const elemArray = location.split("|");
            newObject.postcode = elemArray[0];
            newObject.latitude = elemArray[1];
            newObject.longitude = elemArray[2];
            newObject.method = elemArray[3];
            newObject.type = elemArray[4];
        }
        return newObject;
    }

    getIconType(item) {
        if (item.type === "Unintentional OD") {
            return CategoryColors.find((x) => x.displayName === item.type);
        } else if (item.type === "Drug Related Suicide") {
            return CategoryColors.find((x) => x.displayName === item.type);
        } else {
            const methodFind = CategoryColors.find((x) => x.displayName === item.method);
            if (methodFind) {
                return methodFind;
            } else {
                return { displayName: "Other", color: "red" };
            }
        }
    }

    numberWithCommas(x) {
        if (x === null || typeof x === "undefined") {
            return "Nothing selected";
        } else {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }

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
        Object.keys(this.crossFilterData).forEach((key) => {
            const name = this.crossFilterData[key].filterName;
            const dimgroup = this.crossFilterData[key].dimgroup;
            const type = this.crossFilterData[key].type;
            this[key] = {
                filterName: () => name,
                filter: (f) => this.dimensionFunction(name, f),
                filterAll: () => {},
            };
            switch (type) {
                case "date":
                    this[dimgroup] = {
                        all: () => {
                            const array = [];
                            this.filteredData[name].values.forEach((element) => {
                                array.push({ key: new Date(element.key), value: element.value });
                            });
                            return array;
                        },
                        order: () => {},
                        top: () => {},
                    };
                    break;
                default:
                    this[dimgroup] = {
                        all: () => {
                            return this.filteredData[name].values;
                        },
                        order: () => {},
                        top: () => {},
                    };
                    break;
            }
        });
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
                .json(
                    this.origin.replace("www", "rts" + this.subd) +
                        "/dataset/getCrossfilter?filter=" +
                        this.replaceAmpersand(JSON.stringify(queryFilter)),
                    options
                )
                .then((d) => {
                    if (this.filteredData !== d) {
                        this.filteredData = d;
                        this.icsSelect.redraw();
                        this.bcuSelect.redraw();
                        this.ccgSelect.redraw();
                        this.lancs12Select.redraw();
                        this.myDC.redrawAll();
                        this.MapData.layers = [];
                        this.drawMap();
                        this.loadFilters = {};
                        this.getAverageAge();
                    }
                });
        }
        return null;
    }

    replaceAmpersand(queryString) {
        return queryString.replace(/&/g, "%26");
    }

    resetToWholePop() {
        this.resetBtnPushed = true;
        this.queryFilter = {};
        const header = [["Authorization", "JWT " + this.store.selectSnapshot(AuthState.getToken)]];
        const options: RequestInit = {
            method: "GET",
            headers: header,
        };
        d3.json(this.origin.replace("spi", "storage" + this.subd) + "/spindex/getCrossfilter", options).then((d) => {
            this.filteredData = d;
            this.myDC.filterAll();
            this.icsSelect.redraw();
            this.bcuSelect.redraw();
            this.ccgSelect.redraw();
            this.lancs12Select.redraw();
            this.typeSelect.redraw();
            this.myDC.redrawAll();
            this.MapData.layers = [];
            this.drawMap();
            this.resetBtnPushed = false;
            this.loadFilters = {};
            this.getAverageAge();
        });
    }

    sortedArrayList(values: { key: string[]; value: number }[]) {
        const response: { key: string[]; value: number }[] = [];
        values.forEach((keyvaluePair) => {
            const keyarray = keyvaluePair.key;
            keyarray.forEach((elem) => {
                const check = response.filter((x) => x.key.includes(elem));
                if (check.length > 0) {
                    check[0].value = check[0].value + keyvaluePair.value;
                } else {
                    response.push({ key: [elem], value: keyvaluePair.value });
                }
            });
        });
        return response;
    }

    getDimensionFromName(name: string): any {
        const strippedName = name.replace(`"`, "").replace(`"`, "");
        return this[strippedName];
    }

    convertChartToDim(chartname) {
        switch (chartname) {
            case "mosaicChart":
                return "postcodeMosaic";
        }
        Object.keys(this.crossFilterData).forEach((key) => {
            if (this.crossFilterData[key].chartData) {
                if (chartname === this.crossFilterData[key].chartData.name) {
                    return this.crossFilterData[key].filterName;
                }
            }
        });
    }

    resizeChart(chart, parent, type?) {
        if (chart && type) {
            switch (type) {
                case "slim":
                    chart.height(parent.nativeElement.clientHeight / 2 - 20);
                    chart.width(parent.nativeElement.clientWidth - 50);
                    break;
                default:
                    chart.height(parent.nativeElement.clientHeight - 20);
                    chart.width(parent.nativeElement.clientWidth - 50);
                    break;
            }
        } else if (chart) {
            chart.height(parent.nativeElement.clientHeight - 20);
            chart.width(parent.nativeElement.clientWidth - 50);
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

    createChart(chart, details, parent) {
        chart.dimension(details.dim).group(details.group);

        if (details.type !== "pie" && details.type !== "choropleth" && details.type !== "markermap") {
            chart.margins({
                top: 20,
                right: 10,
                bottom: 30,
                left: 25,
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
            if (details.type !== "pie") {
                this.resizeChart(chart, parent);
            } else {
                this.resizePieChart(chart, parent);
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
            switch (details.round) {
                case "timeDay":
                    chart.round(d3.timeDay.round);
                    break;
                default:
                    chart.round(this.myDC.round.floor);
                    break;
            }
        }
        if (details.alwaysUseRounding) {
            chart.alwaysUseRounding(details.alwaysUseRounding);
        }
        if (details.x) {
            switch (details.x) {
                case "scaleBand":
                    chart.x(d3.scaleBand());
                    break;
                case "time":
                    chart.x(d3.scaleTime().domain([details.xstart, details.xend]));
                    break;
                case "dim":
                    chart.x(d3.scaleOrdinal().domain(details.dim));
                    // if(details.type === 'bar'){
                    //   chart.attr("width", d3.min([x1.rangeBand(), 100]))
                    // }
                    break;
                default:
                    chart.x(d3.scaleLinear().domain([0, 100]));
                    break;
            }
        }
        if (details.xAxisTicks) {
            if (details.timeformat) {
                chart.xAxis().ticks(details.xAxisTicks).tickFormat(d3.timeFormat(details.timeformat));
            } else {
                chart.xAxis().ticks(details.xAxisTicks);
            }
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
                case "custom":
                    chart.ordering((d) => {
                        return details.customOrder[d.key];
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
        if (details.cap) {
            chart.cap(details.cap);
        }
        if (details.centerBar) {
            chart.centerBar(details.centerBar);
        }
        chart.filterHandler((dim, filters) => this.filterHandled(dim, filters));
        chart.commitHandler(async () => {
            await this.refresh(this.queryFilter);
        });
    }

    filterHandled(dim, filters) {
        const name = dim.filterName();
        this.loadFilters[name] = true;
        if (filters) {
            dim.filter(filters);
        } else {
            dim.filter(null);
        }
    }

    async redrawCharts(chart: any, dimName: string) {
        if (typeof chart === "string") {
            Object.keys(this.crossFilterData).forEach((key) => {
                if (this.crossFilterData[key].chartData) {
                    if (chart === this.crossFilterData[key].chartData.name) {
                        this.crossFilterData[key].chart.filterAll();
                    }
                }
            });
        } else {
            chart.filterAll();
        }
        this.getDimensionFromName(dimName).filter(null);
        await this.refresh(this.queryFilter);
    }

    async predefinedFilter(chart: any, data: any) {
        this.crossFilterData[chart]["chart"].filterAll();
        this.crossFilterData[chart]["chart"].filter(data);
        await this.refresh(this.queryFilter);
    }

    showRange(text) {
        this.dialog.open(ExpandTextDialogComponent, {
            width: "350px",
            data: text,
        });
    }

    updateSummaries() {
        const list = this.myDC.chartRegistry.list();
        if (list.length > 0) {
            list.forEach((e) => {
                const chart = list[e];
                if (
                    chart.anchorName() === "dc-data-count" ||
                    chart.anchorName() === "TotalPopulation" ||
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
                return percentTotal;
            });
        this.getAverageAge();
        this.TotalPopulation.render();
        this.TotalSelected.render();
        this.PercentSelected.render();
        this.patientsCount.render();
    }

    humanize(x) {
        if (typeof x === "undefined") {
            return "NA";
        } else {
            return x.toFixed(2).replace(/\.?0*$/, "");
        }
    }

    getAverageAge() {
        let totalAges = 0;
        let totalIncidents = 0;
        if (this.filteredData.age) {
            this.filteredData.age.values.forEach((ageData) => {
                if (this.queryFilter.age) {
                    const ages = this.processAgeFilter();
                    if (ageData.key >= ages.low && ageData.key < ages.high) {
                        totalAges = totalAges + ageData.key * ageData.value;
                        totalIncidents = totalIncidents + ageData.value;
                    }
                } else {
                    totalAges = totalAges + ageData.key * ageData.value;
                    totalIncidents = totalIncidents + ageData.value;
                }
            });
        }
        this.averageAge = totalAges / totalIncidents;
        this.averageAge = this.averageAge.toFixed(2);
    }

    processAgeFilter() {
        if (this.queryFilter.age[0].length > 1) {
            return { low: this.queryFilter.age[0][0], high: this.queryFilter.age[0][1] };
        }
        return { low: this.queryFilter.age[0], high: this.queryFilter.age[1] };
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

    getTooltipHtml(d) {
        const mosaic: any = this.mosaicCodes.find((x) => x.code === d);
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

    exitMosaic() {
        if (this.keyToolTip) {
            this.keyToolTip.style("opacity", 0);
        }
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

    onChartCollapse(type, key) {
        switch (type) {
            case "mosaicChart":
                this.mosaicChartOpenCloseAnim = this.mosaicChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.mosaicChartOpenCloseAnim, type);
                break;
            default:
                this.openCloseAnimation[key] = this.openCloseAnimation[key] === "open" ? "close" : "open";
                this.collapse(this.openCloseAnimation[key], type);
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

    shortenText(text: string): string {
        if (text.length > 25) {
            return text.substr(0, 22) + "...";
        }
        return text;
    }

    tiphtml(d, mosaic) {
        const usedMosaicType = d;
        let output = "";
        output = "	<div id='mosaicToolTip' class='container d3-tip mosaic-" + usedMosaicType.substr(0, 1) + "'>";
        output += "		<div fxLayout='row wrap'>";
        output += "			<div>";
        output += "<h2>" + usedMosaicType + "</h2>";
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
        output += `<img alt="image" class="img-container" src="assets/images/mosaic/mosaic_` + usedMosaicType + `.jpg">`;
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

    OpenCloseAnim(type) {
        return this.openCloseAnimation[type];
    }
}

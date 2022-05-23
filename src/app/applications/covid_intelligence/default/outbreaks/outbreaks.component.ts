import { Component, OnInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import * as dcFull from "dc";
import * as d3 from "d3";
import * as L from "leaflet";
import { StatCardData } from "../../../../shared/stat-card.component";
import { AuthState } from "../../../../_states/auth.state";
import { Store } from "@ngxs/store";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BarChart, LeafletMarkerChart, RowChart, PieChart, HeatMap } from "../../../../_models/chart";
import * as crossfilter from "crossfilter2";
import { collapseAnimations } from "../../../../shared/animations";
import { NotificationService } from "../../../../_services/notification.service";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { APIService, PopulationManagementService } from "diu-component-library";
import { environment } from "src/environments/environment";
declare let leafletMarkerChartBubble: any;
declare let leafletChoroplethChart: any;
declare let window: any;

export const DeprivationColors = [
    "#000000",
    "#40004b",
    "#762a83",
    "#9970ab",
    "#c2a5cf",
    "#e7d4e8",
    "#d9f0d3",
    "#a6dba0",
    "#5aae61",
    "#1b7837",
    "#00441b",
];

@Component({
    selector: "app-outbreaks",
    templateUrl: "./outbreaks.component.html",
    animations: [collapseAnimations],
})
export class OutbreaksComponent implements OnInit {
    @ViewChild("ageChartParent") ageChartParent: ElementRef;
    @ViewChild("mapChartParent") mapChartParent: ElementRef;
    @ViewChild("sexChartParent") sexChartParent: ElementRef;
    @ViewChild("pillarChartParent") pillarChartParent: ElementRef;
    @ViewChild("utlaChartParent") utlaChartParent: ElementRef;
    @ViewChild("ethnicityChartParent") ethnicityChartParent: ElementRef;
    @ViewChild("careHomeChartParent") careHomeChartParent: ElementRef;
    @ViewChild("datesAndAgeBandHeatmapParent") datesAndAgeBandHeatmapParent: ElementRef;
    @ViewChild(MatTable) table: MatTable<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    resetBtnPushed = false;
    loadFilters = {};
    dataLoaded = false;
    TotalPopulation: any;
    incidentsCount: any;
    all: any;
    ndx: any;
    myDC: any;
    filteredData: object;
    filteredDataI: number;
    filteredDataII: number;
    totalsize: number;
    queryFilter: any = {};
    lastQueryFilter: any = {};
    token: any;
    origin: any;
    selectedPopulation = 0;
    DateDimension: any;
    DateDimGroup: any;
    AgeDimension: any;
    AgeDimGroup: any;
    AgeBandDimension: any;
    AgeBandDimGroup: any;
    XDimension: any;
    XDimGroup: any;
    YDimension: any;
    YDimGroup: any;
    CodeDimension: any;
    CodeDimGroup: any;
    EthnicityDimension: any;
    EthnicityDimGroup: any;
    SexDimension: any;
    SexDimGroup: any;
    PillarDimension: any;
    PillarDimGroup: any;
    ULTADimension: any;
    ULTADimGroup: any;
    IsochroneDimension: any;
    IsochroneDimGroup: any;
    CareHomeDimension: any;
    CareHomeDimGroup: any;
    postcodelookup = {};
    dateChart: any;
    risk_poly: any;
    date_start: string;
    date_end: string;
    crudeRateDateStart: string;
    crudeRateDateEnd: string;
    outbreakPoly: any;
    pointsMap = true;
    polyRateLSOA = false;
    polyRateMSOA = false;
    polyRateWard = false;
    polyRateLA = false;
    polyRateUTLA = false;
    polyCloak = false;
    polyCloakUpdateButton = false;
    polyIsochrones = false;
    selectedArea = "lsoa";
    map: any;
    mapPoly: any;
    mapCircleScalingFactor = 20;
    xf: any;
    groupname = "Bubbles";
    totalPositives: any;
    startdate = new Date(2020, 2, 1);
    enddate = new Date();
    datesAndAgeBandHeatmap: any;
    datesAndAgeBandHeatmapDetails: HeatMap;
    datesAndAgeBandHeatmapOpenCloseAnim = "close";
    ageChart: any;
    ageChartDetails: BarChart;
    ageChartOpenCloseAnim = "open";
    ethnicityChart: any;
    ethnicityChartDetails: RowChart;
    ethnicityChartOpenCloseAnim = "open";
    utlaChart: any;
    utlaChartDetails: RowChart;
    utlaChartOpenCloseAnim = "open";
    sexChart: any;
    sexChartDetails: PieChart;
    sexChartOpenCloseAnim = "open";
    pillarChart: any;
    pillarChartDetails: PieChart;
    pillarChartOpenCloseAnim = "open";
    careHomeChart: any;
    careHomeChartDetails: PieChart;
    careHomeChartOpenCloseAnim = "open";
    mapChartDetails: LeafletMarkerChart;
    dateChartOpenCloseAnim = "open";
    loading = false;
    maxScore: number;
    maxDiff: number;
    unknownNumber: string;
    mapZoom = 9;
    mapCentre = {
        lat: 53.988255,
        lng: -2.773179,
    };
    currentZoom = 9;
    currentCentre = {
        lat: 53.988255,
        lng: -2.773179,
    };
    n_weeks: number;
    csvData: any = [
        {
            area: "-----",
            crude_rate: "-----",
            crude_rate_per_thousand: "-----",
            positives: "-----",
            n_weeks: "-----",
        },
    ];
    polyMinOpacity = 0;
    polyMapOpacity = 0;
    firstLoad = true;

    leftstatcard: StatCardData = {
        title: "TOTAL POSITIVES",
        value: "TOTALPOSITIVES",
        icon: "group",
        color: "bg-warning",
        text: "-",
    };
    midleftstatcard: StatCardData = {
        title: "SELECTED POSITIVES",
        value: "Pillar1Total",
        icon: "group",
        color: "bg-danger",
        text: "-",
    };
    rightstatcard: StatCardData = {
        title: "PERCENT SELECTED",
        value: "PercentSelected",
        icon: "group",
        color: "bg-primary",
        text: "-",
    };
    leafletMaprendered = false;
    exampleData = [
        {
            properties: {
                area: "",
                crude_rate_per_thousand: "Please Select A Geography To Get Crude-Rates (7-day average per 100 000)",
                rate_diff: "",
            },
        },
    ];
    displayedColumns: string[] = [
        "properties.area",
        "properties.crude_rate_per_thousand",
        "properties.crude_rate",
        "properties.positives",
        "properties.care_home_ratio",
        "properties.rate_diff",
    ];
    dataSource: MatTableDataSource<any>;
    opacityCeilingPoint = "100%";
    showRateChange = false;
    waitingForRequest = false;
    httpRequest: string;
    careHomeSelect: any;
    oneDay: number = 24 * 60 * 60 * 1000;

    @HostListener("window:resize", ["$event"])
    onResize() {
        setTimeout(() => {
            if (!this.firstLoad) {
                this.drawCharts();
            }
        }, 0);
    }

    constructor(
        public store: Store,
        public http: HttpClient,
        private apiService: APIService,
        private notificationService: NotificationService,
        private populationManagementService: PopulationManagementService
    ) {
        this.token = this.store.selectSnapshot(AuthState.getToken);
        const parsedUrl = window.location.href;
        this.origin = parsedUrl.replace("/outbreaks", "");
        if (this.origin.includes("localhost")) {
            this.origin = "https://www." + environment.websiteURL;
        }
        this.dataSource = new MatTableDataSource(this.exampleData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit() {
        this.populatePostCodeLookup();
        this.buildCF();
    }

    populatePostCodeLookup() {
        this.postcodelookup = {};
        this.apiService.getPostcodeLookup().subscribe((data: any) => {
            this.postcodelookup = data;
        });
    }

    buildCF() {
        this.myDC = dcFull;
        this.populationManagementService.getCFServer().subscribe((res: any) => {
            this.dataLoaded = true;
            this.filteredData = res;
            this.totalsize = this.filteredData["all"].values;
            this.totalPositives = this.totalsize;
            this.buildCFServer();
            setTimeout(() => {
                this.drawCharts();
            }, 200);
        });
    }

    setArea(area: string) {
        this.selectedArea = area;
        if (this.polyRateLSOA || this.polyRateMSOA || this.polyRateWard || this.polyRateLA || this.polyRateUTLA) {
            this.runScanStats(false, "rate", area);
        } else {
            this.polyCloak ? this.runScanStats(false, "cloak", area) : "";
        }
    }

    runScanStats(initialRun: boolean, api_method: string, geo_level: string) {
        // Allow API call without dates specified for crude rates, don't allow for
        //   scan-statistics model run
        if (!this.date_start) {
            if (api_method === "rate") {
                this.date_start = "2020-03-01";
                this.date_end = this.formatDate(new Date());
            } else {
                this.notificationService.warning("Please Select A Date Range Before Running Models");
                return;
            }
        }
        if (
            this.formatDate(this.date_start) === "2020-03-01" &&
            this.formatDate(this.date_end) === this.formatDate(new Date()) &&
            api_method === "cloak"
        ) {
            this.notificationService.warning("Please Select A Date Range Before Running Models");
            return;
        }
        let http_request = "";

        if (!this.pointsMap) {
            this.currentZoom = this.mapPoly.getZoom();
            this.currentCentre = this.mapPoly.getCenter();
        } else {
            this.currentZoom = this.mapZoom;
            this.currentCentre = this.mapCentre;
        }

        this.pointsMap = initialRun;
        this.polyRateLSOA = false;
        this.polyRateMSOA = false;
        this.polyRateWard = false;
        this.polyRateLA = false;
        this.polyRateUTLA = false;
        this.polyCloak = false;
        this.polyCloakUpdateButton = false;
        this.polyIsochrones = false;

        console.log("Running " + (api_method === "rate" ? "Rate" : "CLOAK") + "...");

        if (api_method === "rate") {
            switch (geo_level) {
                case "lsoa":
                    this.polyRateLSOA = true;
                    this.displayedColumns = [
                        "properties.area",
                        "properties.la",
                        "properties.crude_rate_per_thousand",
                        "properties.crude_rate",
                        "properties.positives",
                        "properties.care_home_ratio",
                        "properties.rate_diff",
                    ];
                    break;
                case "msoa":
                    this.polyRateMSOA = true;
                    this.displayedColumns = [
                        "properties.area",
                        "properties.la",
                        "properties.crude_rate_per_thousand",
                        "properties.crude_rate",
                        "properties.positives",
                        "properties.care_home_ratio",
                        "properties.rate_diff",
                    ];
                    break;
                case "ward":
                    this.polyRateWard = true;
                    this.displayedColumns = [
                        "properties.area",
                        "properties.la",
                        "properties.crude_rate_per_thousand",
                        "properties.crude_rate",
                        "properties.positives",
                        "properties.care_home_ratio",
                        "properties.rate_diff",
                    ];
                    break;
                case "la":
                    this.polyRateLA = true;
                    this.displayedColumns = [
                        "properties.area",
                        "properties.crude_rate_per_thousand",
                        "properties.crude_rate",
                        "properties.positives",
                        "properties.care_home_ratio",
                        "properties.rate_diff",
                    ];
                    break;
                case "utla":
                    this.polyRateUTLA = true;
                    this.displayedColumns = [
                        "properties.area",
                        "properties.crude_rate_per_thousand",
                        "properties.crude_rate",
                        "properties.positives",
                        "properties.care_home_ratio",
                        "properties.rate_diff",
                    ];
                    break;
                default:
                    geo_level = "lsoa";
                    this.polyRateLSOA = true;
            }

            this.crudeRateDateStart = this.date_start;
            this.crudeRateDateEnd = this.date_end;
        } else {
            switch (geo_level) {
                case "lsoa":
                    break;
                case "msoa":
                    break;
                case "ward":
                    break;
                case "la":
                    break;
                case "utla":
                    break;
                default:
                    geo_level = "lsoa";
            }

            this.polyCloak = true;
            this.polyCloakUpdateButton = true;
        }

        this.loading = true;
        document.getElementById("mapContainer").style.display = "none";

        // TODO: what has the smtp subdomain become in the new mapping
        http_request =
            "https://smtp." +
            environment.websiteURL +
            "/" +
            (api_method === "rate" ? "covid_crude_rate?" : "cloak?") +
            "date_start=" +
            this.formatDate(this.date_start) +
            "&" +
            "date_end=" +
            this.formatDate(this.date_end) +
            "&" +
            "geo_level=" +
            geo_level;

        this.httpRequest = http_request;

        setTimeout(() => {
            this.getScanStats(api_method);
        }, 1000);
        // this.getScanStats(api_method);
    }

    // Get Crude Rate or Scan Stats data from plumbeR API
    getScanStats(api_method: string) {
        if (!this.waitingForRequest) {
            this.waitingForRequest = true;
            this.http
                .get(this.httpRequest, {
                    headers: new HttpHeaders({
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "Access-Control-Allow-Origin": "*",
                    }),
                    observe: "response",
                })
                .subscribe(
                    (res: any) => {
                        this.loading = false;
                        this.waitingForRequest = false;
                        this.risk_poly = JSON.parse(res.body[0]);
                        const risk_arr = this.risk_poly.features;
                        if (api_method === "rate") {
                            this.maxScore = Math.max(
                                ...risk_arr.map((o) => {
                                    const rate = o.properties.crude_rate_per_thousand;
                                    if (isNaN(rate)) {
                                        return 0;
                                    } else {
                                        return rate;
                                    }
                                })
                            );

                            this.maxDiff = Math.max(...risk_arr.map((o) => Math.abs(o.properties.rate_diff)));

                            this.n_weeks = this.weeksBetween(new Date(this.date_start), this.addDays(this.date_end, 1));
                            this.dataSource.data = this.risk_poly.features;
                            this.dataSource.data.sort((a, b) => {
                                return b.properties.crude_rate_per_thousand - a.properties.crude_rate_per_thousand;
                            });
                            this.dataSource.data.forEach((d) => {
                                d.properties.crude_rate_per_thousand = Math.round(100 * d.properties.crude_rate_per_thousand) / 100;
                                d.properties.crude_rate = Math.round(100 * d.properties.crude_rate_per_thousand * this.n_weeks) / 100;
                                d.properties.rate_diff = Math.round(100 * d.properties.rate_diff) / 100;
                                d.properties.previous_crude_rate_per_thousand =
                                    Math.round(100 * d.properties.previous_crude_rate_per_thousand) / 100;
                            });
                            this.dataSource.data.filter((d) => {
                                d.properties.district_boundary !== "black" && d.properties.lancs_pop;
                            });
                            this.dataSource.paginator = this.paginator;
                            this.dataSource.sort = this.sort;
                            if (this.polyRateMSOA) {
                                this.risk_poly.features.forEach((d) => {
                                    d.properties.msoa_code = d.properties.area;
                                    d.properties.area = d.properties.msoa_nice_name;
                                });
                            }
                        } else {
                            this.maxScore = Math.max(...risk_arr.map((o) => o.properties.relative_score));
                            this.maxDiff = 1;
                        }
                        this.polyMinOpacity = 0;
                        this.risk_poly.features.forEach((d) => {
                            d.max_score = this.maxScore;
                            d.start_date = this.formatDate(this.date_start);
                            d.end_date = this.formatDate(this.date_end);
                            d.min_opacity = this.polyMinOpacity;
                            d.max_diff = this.maxDiff;
                        });
                        if (api_method === "rate") {
                            this.risk_poly.features.sort((a, b) => {
                                return a.properties.crude_rate_per_thousand - b.properties.crude_rate_per_thousand;
                            });
                        }
                        this.plotScanStats(api_method);
                        this.waitingForRequest = false;
                    },
                    (error) => {
                        this.loading = false;
                        this.notificationService.error("Server error: " + error.toString());
                        this.waitingForRequest = false;
                    }
                );
        } else {
            this.loading = false;
        }
    }

    plotScanStats(api_method: string) {
        if (api_method === "cloak") {
            this.showRateChange = false;
        }
        this.risk_poly.features.forEach((d) => (d.min_opacity = this.polyMinOpacity));
        this.updateColourBar();

        if (api_method === "rate") {
            document.getElementById(
                "polyRateContainer"
            ).innerHTML = `<div class="mapRatePoly"><br><br><br><br><br><br><br><br><br><br><br><br>
                <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div>`;
        } else {
            document.getElementById(
                "polyCloakContainer"
            ).innerHTML = `<div class="mapCloakPoly"><br><br><br><br><br><br><br><br><br><br><br><br>
                <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div>`;
        }
        const width = document.getElementById(api_method === "rate" ? "polyRateContainer" : "polyCloakContainer").offsetWidth;
        const risk_data = crossfilter(this.risk_poly.features);
        const area = risk_data.dimension((d: any) => d.properties.area);
        const areaGroup = area.group();

        this.mapPoly = leafletChoroplethChart(
            api_method === "rate" ? "#polyRateContainer .mapRatePoly" : "#polyCloakContainer .mapCloakPoly",
            this.groupname
        )
            .dimension(area)
            .group(areaGroup)
            .width(width)
            .height(500)
            .changeOpacity(1 - this.polyMapOpacity / 1000)
            .mapOptions({
                zoom: this.currentZoom,
                center: this.currentCentre,
            })
            .geojson(this.risk_poly)
            .featureStyle(function () {
                if (this.showRateChange) {
                    return this.styleRateDiff;
                } else {
                    if (this.polyRateLSOA || this.polyRateMSOA || this.polyRateWard) {
                        return this.styleRateNoBoundary;
                    } else {
                        return this.polyCloak ? this.styleCloak : this.styleRate;
                    }
                }
            })
            .featureKeyAccessor((d: any) => d.properties.area)
            .popup(this.polyCloak ? this.cloakKV : this.rateKV);

        this.mapPoly.render();
        dcFull.renderAll(this.groupname);

        if (this.ageChartOpenCloseAnim === "open") {
            this.onChartCollapse("ageChart");
        }
        if (this.ethnicityChartOpenCloseAnim === "open") {
            this.onChartCollapse("ethnicityChart");
        }
        if (this.sexChartOpenCloseAnim === "open") {
            this.onChartCollapse("sexChart");
        }
        if (this.pillarChartOpenCloseAnim === "open") {
            this.onChartCollapse("pillarChart");
        }
        if (this.utlaChartOpenCloseAnim === "open") {
            this.onChartCollapse("utlaChart");
        }
        if (this.dateChartOpenCloseAnim === "close") {
            this.onChartCollapse("dateChart");
        }
        if (this.careHomeChartOpenCloseAnim === "open") {
            this.onChartCollapse("careHomeChart");
        }
        if (this.datesAndAgeBandHeatmapOpenCloseAnim === "open") {
            this.onChartCollapse("datesAndAgeBandHeatmap");
        }
    }

    rateKV(kv) {
        if (kv.value[0] || kv.value[0] === 0) {
            return (
                "<b>Area</b> : " +
                kv.key +
                ", <br> <b>COVID Cases per 100 000 per week</b> : " +
                kv.value[0] +
                " (CI " +
                kv.value[1] +
                " - " +
                kv.value[2] +
                ")" +
                ", <br> <b>Positives Cases</b> : " +
                kv.value[3] +
                ", <br> <b>Proportion of Cases Within Care Homes</b> : " +
                kv.value[7] +
                "%, <br> <b>Date Range</b> : " +
                kv.value[4] +
                " <b>-</b> " +
                kv.value[5] +
                ", <br> <b>COVID Rate (per 100 000 per week) Change</b> : " +
                kv.value[6]
            );
        }
    }

    cloakKV(kv) {
        return "<b>Area</b> : " + kv.key + ", <br> <b>Relative Risk Score</b> : " + kv.value;
    }

    styleRate(feature) {
        const o = feature.min_opacity / 1000;
        const s = feature.properties.crude_rate_per_thousand / feature.max_score;

        return {
            fillColor: "#800080",
            weight: 1,
            fillOpacity: 0.8 * Math.min(1, (Math.sin(s + o) - Math.sin(o)) / (Math.sin(1 + o) - Math.sin(o))),
            color: "#800080",
            opacity: null,
        };
    }

    styleRateNoBoundary(feature) {
        const o = feature.min_opacity / 1000;
        const s = feature.properties.crude_rate_per_thousand / feature.max_score;

        return {
            fillColor: "#800080",
            weight: 1,
            fillOpacity: 0.8 * Math.min(1, (Math.sin(s + o) - Math.sin(o)) / (Math.sin(1 + o) - Math.sin(o))),
            color: feature.properties.district_boundary,
            opacity: null,
        };
    }

    styleRateDiff(feature) {
        const diffRGB = feature.properties.rate_diff < 0 ? [-247, -111, -192] : [-124, -197, -99];
        const minRGB = [247, 247, 247];
        const colourRGB = diffRGB
            .map((x) => {
                return (x * Math.abs(feature.properties.rate_diff)) / feature.max_diff;
            })
            .map((x, index) => {
                return Math.round(x + minRGB[index]);
            });

        const colourHex =
            "#" +
            colourRGB
                .map((x) => {
                    const hex = x.toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                })
                .join("");

        return {
            fillColor: colourHex,
            weight: 1,
            fillOpacity: 0.7,
            color: feature.properties.district_boundary,
            opacity: null,
        };
    }

    styleCloak(feature) {
        const o = feature.min_opacity / 1000;
        const s = feature.properties.relative_score;

        return {
            fillColor: "#800080",
            weight: 1,
            fillOpacity: 0.8 * Math.min(1, (Math.sin(s + o) - Math.sin(o)) / (Math.sin(1 + o) - Math.sin(o))),
            color: null,
            opacity: null,
        };
    }

    getOutbreakJson() {
        this.loading = true;

        if (!this.pointsMap) {
            this.currentZoom = this.mapPoly.getZoom();
            this.currentCentre = this.mapPoly.getCenter();
        } else {
            this.currentZoom = this.mapZoom;
            this.currentCentre = this.mapCentre;
        }

        this.pointsMap = false;
        this.polyRateLSOA = false;
        this.polyRateMSOA = false;
        this.polyRateWard = false;
        this.polyRateLA = false;
        this.polyRateUTLA = false;
        this.polyCloak = false;
        this.polyCloakUpdateButton = false;
        this.polyIsochrones = true;

        document.getElementById("mapContainer").style.display = "none";

        const http_request = "https://api." + environment.websiteURL + "/outbreak/mapinfo";
        this.http
            .get(http_request, {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                }),
                observe: "response",
            })
            .subscribe(
                (res: any) => {
                    this.loading = false;
                    this.outbreakPoly = res.body[0];
                    const outbreakArr = this.outbreakPoly.features;
                    this.maxScore = Math.max(...outbreakArr.map((o) => o.properties.f6));
                    this.outbreakPoly.features.forEach((d) => {
                        d.max_score = this.maxScore;
                        d.min_opacity = this.polyMinOpacity;
                    });

                    // Put in ascending risk order, so that most risky places are drawn last
                    this.outbreakPoly.features.reverse();
                    this.polyMinOpacity = 0;
                    this.plotIsochrones();
                },
                (error) => {
                    this.loading = false;
                    this.notificationService.warning("Error: " + error.toString());
                }
            );
    }

    plotIsochrones() {
        this.showRateChange = false;
        this.outbreakPoly.features.forEach((d) => (d.min_opacity = this.polyMinOpacity));
        this.updateColourBar();

        document.getElementById("isochroneContainer").innerHTML = `<div class="mapIsochrone">
      <br><br><br><br><br><br><br><br><br><br><br>
      <br><br><br><br><br><br><br><br><br><br><br>
      <br><br><br><br><br><br><br><br><br><br>
      </div>`;

        const width = document.getElementById("isochroneContainer").offsetWidth;
        const isochrones = crossfilter(this.outbreakPoly.features);
        const isochroneDim = isochrones.dimension((d: any) => d.properties.f1);
        const isochroneDimGroup = isochroneDim.group();

        this.mapPoly = leafletChoroplethChart("#isochroneContainer .mapIsochrone", this.groupname)
            .dimension(isochroneDim)
            .group(isochroneDimGroup)
            .width(width)
            .height(500)
            .changeOpacity(1 - this.polyMapOpacity / 1000)
            .mapOptions({
                zoom: this.currentZoom,
                center: this.currentCentre,
            })
            .geojson(this.outbreakPoly)
            .featureStyle(this.styleOutbreak)
            // .featureKeyAccessor((d) => d.isoids)
            .featureKeyAccessor((d) => d.properties.f1)
            .popup((kv) => {
                return (
                    "<b>Isochrone Infection Density</b> : " +
                    kv.value[1] +
                    "<br> <b> Isochrone Travel-Time : " +
                    kv.value[0] +
                    " [mins walking]"
                );
            });

        this.mapPoly.render();
        dcFull.renderAll(this.groupname);

        if (this.ageChartOpenCloseAnim === "open") {
            this.onChartCollapse("ageChart");
        }
        if (this.ethnicityChartOpenCloseAnim === "open") {
            this.onChartCollapse("ethnicityChart");
        }
        if (this.sexChartOpenCloseAnim === "open") {
            this.onChartCollapse("sexChart");
        }
        if (this.pillarChartOpenCloseAnim === "open") {
            this.onChartCollapse("pillarChart");
        }
        if (this.utlaChartOpenCloseAnim === "open") {
            this.onChartCollapse("utlaChart");
        }
        if (this.dateChartOpenCloseAnim === "open") {
            this.onChartCollapse("dateChart");
        }
        if (this.careHomeChartOpenCloseAnim === "open") {
            this.onChartCollapse("careHomeChart");
        }
    }

    styleOutbreak(feature) {
        const o = feature.min_opacity / 1000;
        const s = feature.properties.f6 / feature.max_score;

        return {
            fillColor: "#800080",
            weight: 1,
            fillOpacity: 0.8 * Math.min(1, (Math.sin(s + o) - Math.sin(o)) / (Math.sin(1 + o) - Math.sin(o))),
            color: null,
            opacity: null,
        };
    }

    updateColourBar() {
        let maxOpacityPoint = Math.asin(Math.sin(1 + this.polyMinOpacity / 1000)) - this.polyMinOpacity / 1000;
        this.opacityCeilingPoint = maxOpacityPoint * 100 + "%";
        let halfOpacityPoint =
            Math.asin(0.5 * (Math.sin(1 + this.polyMinOpacity / 1000) + Math.sin(this.polyMinOpacity / 1000))) - this.polyMinOpacity / 1000;
        if (!this.polyCloak) {
            halfOpacityPoint *= this.maxScore;
            maxOpacityPoint *= this.maxScore;
        }
        const colourBar = document.getElementById("colourBarDiv");
        if (this.showRateChange) {
            colourBar.setAttribute("style", "background:linear-gradient(to right, #008837, #f7f7f7, #7b3294); height:20px");
        } else {
            colourBar.setAttribute("style", "background:linear-gradient(to right, #ffffff 0%, #800080 100%); height:20px");
        }
        let colourBarUnits;
        let colourBarTitle;
        switch (true) {
            case this.polyIsochrones:
                colourBarUnits = " [m<sup>-2</sup>]";
                colourBarTitle = "Isochrone Infection Intensity";
                break;
            case this.polyCloak:
                colourBarUnits = " ";
                colourBarTitle = "Relative Score";
                break;
            case this.showRateChange:
                colourBarUnits = " ";
                colourBarTitle =
                    "Change in COVID Cases (Per 100 000 Per Week):" +
                    " (" +
                    this.formatDate(this.date_start) +
                    " to " +
                    this.formatDate(this.date_end) +
                    ") " +
                    "vs (" +
                    this.formatDate(this.addDays(this.date_start, -this.n_weeks * 7)) +
                    " to " +
                    this.formatDate(this.addDays(this.date_end, -this.n_weeks * 7)) +
                    ")";
                break;
            default:
                colourBarUnits = " ";
                colourBarTitle = "COVID Cases Per 100 000 Per Week";
        }
        colourBar.innerHTML = "<br>";
        if (this.showRateChange) {
            colourBar.innerHTML +=
                `<div style="width:33%;float:left;text-align:left">` +
                -Math.round(100 * this.maxDiff) / 100 +
                "</div>" +
                `<div style="width:33%;float:left;text-align:center;">0</div>` +
                `<div style="width:33%;float:right;text-align:right;">` +
                Math.round(100 * this.maxDiff) / 100 +
                "</div>";
        } else {
            colourBar.innerHTML +=
                `<div style="width:33%;float:left;text-align:left"> 0` +
                colourBarUnits +
                "</div>" +
                `<div style="width:33%;float:left;text-align:center;">` +
                Math.round(100 * halfOpacityPoint) / 100 +
                colourBarUnits +
                "</div>" +
                `<div style="width:33%;float:right;text-align:right;">` +
                Math.round(100 * maxOpacityPoint) / 100 +
                colourBarUnits +
                " - " +
                Math.round(100 * this.maxScore) / 100 +
                colourBarUnits +
                "</div>";
        }

        colourBar.innerHTML += "<br><p style=text-align:center;>" + colourBarTitle + "</p>";
    }

    showBubbleMap() {
        this.originalShowBubbleMap();
        this.originalShowBubbleMap();
    }

    originalShowBubbleMap() {
        this.pointsMap = true;
        this.polyRateLSOA = false;
        this.polyRateMSOA = false;
        this.polyRateWard = false;
        this.polyRateLA = false;
        this.polyRateUTLA = false;
        this.polyCloak = false;
        this.polyCloakUpdateButton = false;
        this.polyIsochrones = false;
        document.getElementById("mapContainer").style.display = "block";

        // Re-open charts if they're closed
        if (this.ageChartOpenCloseAnim === "close") {
            this.onChartCollapse("ageChart");
        }
        if (this.ethnicityChartOpenCloseAnim === "close") {
            this.onChartCollapse("ethnicityChart");
        }
        if (this.sexChartOpenCloseAnim === "close") {
            this.onChartCollapse("sexChart");
        }
        if (this.pillarChartOpenCloseAnim === "close") {
            this.onChartCollapse("pillarChart");
        }
        if (this.utlaChartOpenCloseAnim === "close") {
            this.onChartCollapse("utlaChart");
        }
        if (this.dateChartOpenCloseAnim === "close") {
            this.onChartCollapse("dateChart");
        }
        if (this.datesAndAgeBandHeatmapOpenCloseAnim === "close") {
            this.onChartCollapse("datesAndAgeBandHeatmap");
        }
        this.map.redraw();
    }

    formatDate(date) {
        const d = new Date(date);
        let month = "" + (d.getMonth() + 1);
        let day = "" + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) {
            month = "0" + month;
        }
        if (day.length < 2) {
            day = "0" + day;
        }

        return [year, month, day].join("-");
    }

    addDays(date: any, days: number) {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }

    drawCharts() {
        const width = document.getElementById("mapContainer").offsetWidth;
        if (this.totalsize) {
            this.leftstatcard.text = this.totalsize.toString();
        }

        this.map = leafletMarkerChartBubble("#mapContainer .map")
            .dimension(this.CodeDimension)
            .group(this.CodeDimGroup)
            .width(width)
            .height(500)
            .mapOptions({
                zoom: 9,
                center: {
                    lat: 53.988255,
                    lng: -2.773179,
                },
            })
            .circleScale(this.mapCircleScalingFactor)
            .locationAccessor((d) => this.postcodelookup[d.key])
            .cluster(true)
            .clusterOptions({
                spiderfyOnMaxZoom: true,
                showCoverageOnHover: true,
                zoomToBoundsOnClick: true,
                disableClusteringAtZoom: 15,
                maxClusterRadius: 120,
                iconCreateFunction: (cluster) => {
                    const markers = cluster.getAllChildMarkers();
                    let n = 0;
                    for (const i of markers) {
                        n += i.options.sizeValue;
                    }
                    let c = " marker-cluster-";
                    if (n < 10) {
                        c += "small";
                    } else if (n < 100) {
                        c += "medium";
                    } else if (n < 1000) {
                        c += "large";
                    } else {
                        c += "xlarge";
                    }
                    return new L.DivIcon({
                        html: "<div class='inner-cluster'><span><b>" + n + "</b></span></div>",
                        className: "marker-cluster" + c,
                        iconSize: new L.Point(50, 50),
                    });
                },
            })
            .rebuildcircles(true);
        // .r(d3.scaleLog().domain([1, max]).range([0, 20]));

        this.map.on("preRedraw", (chart) => {
            chart.circleScale(this.mapCircleScalingFactor);
        });
        this.map.on("renderlet", () => {
            this.leafletMaprendered = true;
        });
        this.map.on("filtered", () => {});
        this.map.filterHandler((dim, filters) => this.filterHandled(dim, filters));
        // this.map.commitHandler(async (err, result) => {
        //   await this.refresh(this.queryFilter);
        // });

        if (this.dateChartOpenCloseAnim === "open") {
            this.dateChart = this.myDC.barChart(".datesel").dimension(this.DateDimension).group(this.DateDimGroup);

            this.dateChart
                .width(width)
                .height(150)
                .margins({ top: 0, right: 50, bottom: 20, left: 40 })
                .centerBar(true)
                .gap(1)
                .x(d3.scaleTime().domain([this.startdate, this.enddate]))
                .round(d3.timeDay.round)
                .alwaysUseRounding(true)
                .xUnits(() => {
                    return 150;
                })
                .elasticY(true);

            this.dateChart.xAxis().ticks(d3.timeWeek.every(2)).tickFormat(d3.timeFormat("%d %b"));

            this.dateChart.filterHandler((dim, filters) => {
                let filter;
                if (filters && filters.length > 0) {
                    filter = filters[0];
                } else {
                    filter = [this.formatDate("2020-01-01"), this.formatDate(new Date())];
                }
                this.date_start = filter[0];
                this.date_end = filter[1];
                this.filterHandled(dim, [filter]);

                if (this.polyRateLSOA) {
                    this.runScanStats(false, "rate", "lsoa");
                }
                if (this.polyRateMSOA) {
                    this.runScanStats(false, "rate", "msoa");
                }
                if (this.polyRateWard) {
                    this.runScanStats(false, "rate", "ward");
                }
                if (this.polyRateLA) {
                    this.runScanStats(false, "rate", "la");
                }
                if (this.polyRateUTLA) {
                    this.runScanStats(false, "rate", "utla");
                }
                if (this.polyCloak) {
                    this.polyCloakUpdateButton = false;
                }
            });
            this.dateChart.commitHandler(async () => {
                await this.refresh(this.queryFilter);
            });
            this.dateChart.render();
        }
        // selected
        if (this.sexChartOpenCloseAnim === "open") {
            this.createSexChart(this.SexDimension, this.SexDimGroup);
        }
        if (this.pillarChartOpenCloseAnim === "open") {
            this.createPillarChart(this.PillarDimension, this.PillarDimGroup);
        }
        if (this.ageChartOpenCloseAnim === "open") {
            this.createAgeChart(this.AgeDimension, this.AgeDimGroup);
        }
        if (this.ethnicityChartOpenCloseAnim === "open") {
            this.createEthnicityChart(this.EthnicityDimension, this.EthnicityDimGroup);
        }
        if (this.utlaChartOpenCloseAnim === "open") {
            this.createULTAChart(this.ULTADimension, this.ULTADimGroup);
        }

        if (this.careHomeChartOpenCloseAnim === "open") {
            this.createCareHomeChart(this.CareHomeDimension, this.CareHomeDimGroup);
        }

        if (this.datesAndAgeBandHeatmapOpenCloseAnim === "open") {
            this.createDatesAndAgeBandHeatmap(this.AgeBandDimension, this.AgeBandDimGroup);
        }

        this.renderCharts();
        if (this.firstLoad) {
            this.firstLoad = false;
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

    createEthnicityChart(dimension: any, group: any) {
        this.ethnicityChartDetails = {
            title: "Ethnicity",
            type: "row",
            dim: dimension,
            group,
            name: "ethnicityChart",
            // x: "scaleBand",
            // xUnits: "ordinal",
            renderLabel: true,
            elasticX: true,
            cap: 11,
            ordering: "descD",
            xAxisTicks: 3,
        };
        this.ethnicityChart = this.myDC.rowChart("#" + this.ethnicityChartDetails.name);

        this.createChart(this.ethnicityChart, this.ethnicityChartDetails, this.ethnicityChartParent);
    }

    createULTAChart(dimension: any, group: any) {
        this.utlaChartDetails = {
            title: "ULTA",
            type: "row",
            dim: dimension,
            group,
            name: "utlaChart",
            // x: "scaleBand",
            // xUnits: "ordinal",
            renderLabel: true,
            elasticX: true,
            cap: 16,
            ordering: "descD",
            xAxisTicks: 3,
        };
        this.utlaChart = this.myDC.rowChart("#" + this.utlaChartDetails.name);

        this.createChart(this.utlaChart, this.utlaChartDetails, this.utlaChartParent);
    }

    createSexChart(dimension: any, group: any) {
        this.sexChartDetails = {
            title: "Sex",
            type: "pie",
            dim: dimension,
            group,
            name: "sexChart",
            ordinalColors: ["#E03F8B", "#4D75BA"],
        };
        this.sexChart = this.myDC.pieChart("#" + this.sexChartDetails.name);
        this.createChart(this.sexChart, this.sexChartDetails, this.sexChartParent);
    }

    createCareHomeChart(dimension: any, group: any) {
        this.careHomeChartDetails = {
            title: "Care Home",
            type: "pie",
            dim: dimension,
            group,
            name: "careHomeChart",
            ordinalColors: ["#E03F8B", "#4D75BA"],
        };
        this.careHomeChart = this.myDC.pieChart("#" + this.careHomeChartDetails.name);
        this.createChart(this.careHomeChart, this.careHomeChartDetails, this.careHomeChartParent);
    }

    createPillarChart(dimension: any, group: any) {
        this.pillarChartDetails = {
            title: "Pillar",
            type: "pie",
            dim: dimension,
            group,
            name: "pillarChart",
            ordinalColors: ["#E03F8B", "#4D75BA"],
        };
        this.pillarChart = this.myDC.pieChart("#" + this.pillarChartDetails.name);
        this.createChart(this.pillarChart, this.pillarChartDetails, this.pillarChartParent);
    }

    getKeyByValue(value, object) {
        return Object.keys(object).find((key) => {
            return object[key] === value;
        });
    }

    // This crossfilter fake group filtering ensures there's no null ages or 0 cases
    removeZeroAndNullAgeCases(groupedDimension) {
        return {
            all: () => {
                return groupedDimension.all().filter((d) => {
                    return d.value !== 0 && d.key[1] !== null;
                });
            },
        };
    }

    createDatesAndAgeBandHeatmap(dimension: any, group: any) {
        const ageRangeMap = {
            null: 0,
            "0 - 15": 1,
            "16 - 29": 2,
            "30 - 44": 3,
            "45 - 59": 4,
            "60+": 5,
        };
        const filteredAgeBandDimGroup = this.removeZeroAndNullAgeCases(group);
        this.datesAndAgeBandHeatmapDetails = {
            title: "Dates and age bands",
            type: "heat",
            dim: dimension,
            group: filteredAgeBandDimGroup,
            name: "datesAndAgeBandHeatmap",
            colorAccessor: (d) => {
                return +d.value;
            },
            titlefunction: (d) => {
                return [
                    `Date: ${new Date(d.key[0]).toLocaleDateString()}`,
                    `Age range: ${d.key[1] as string}`,
                    `Cases: ${d.value as string}`,
                ].join("\n");
            },
            keyAccessor: (d) => {
                return +new Date(d.key[0]);
            },
            valueAccessor: (d) => {
                return +ageRangeMap[d.key[1]];
            },
            colours: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
            calculateColorDomain: true,
            colsLabel: (col, i) => {
                const timeLineStartDate = new Date(this.date_start || this.startdate);
                const timeLineEndDate = new Date(this.date_end || this.enddate);
                const daysBetweenTimeline = this.daysBetweenDates(timeLineEndDate, timeLineStartDate);
                const daysScalingFactor = Math.ceil(daysBetweenTimeline / 32);
                if (i % daysScalingFactor === 0) {
                    const colDate = new Date(col);
                    return `${colDate.getUTCDate()}/${colDate.getUTCMonth() + 1}`;
                }
            },
            rowsLabel: (row) => {
                return this.getKeyByValue(row, ageRangeMap);
            },
        };
        this.datesAndAgeBandHeatmap = this.myDC.heatMap("#" + this.datesAndAgeBandHeatmapDetails.name);
        this.createChart(this.datesAndAgeBandHeatmap, this.datesAndAgeBandHeatmapDetails, this.datesAndAgeBandHeatmapParent);
    }

    filterHandled(dim, filters) {
        const name = dim.filterName();
        this.loadFilters[name] = true;
        if (filters) {
            // Date filtering offsets the date-range by one day when returning data,
            //   so this adds the day back to get the correct numbers back (when
            //   comparing with values from the DB)
            if (name === "DateDimension") {
                filters = [[this.addDays(filters[0][0], 1), this.addDays(filters[0][1], 1)]];
            }
            dim.filter(filters);

            // Update count of selected Positives
            setTimeout(() => {
                const filteredPositives = this.filteredData["all"].values;
                this.midleftstatcard.text = filteredPositives.toString();
                this.rightstatcard.text = Math.round((100 * filteredPositives) / this.totalPositives)
                    .toString()
                    .concat(" %");
            }, 2000);
        } else {
            dim.filter(null);
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
        this.DateDimension = {
            filterName: () => "DateDimension",
            filter: (f) => this.dimensionFunction("date", f),
            filterAll: () => {},
        };
        this.DateDimGroup = {
            all: () => {
                this.filteredData["date"].values.forEach((element) => {
                    element.key = new Date(element.key);
                });
                return this.filteredData["date"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.AgeDimension = {
            filterName: () => "AgeDimension",
            filter: (f) => this.dimensionFunction("age", f),
            filterAll: () => {},
        };
        this.AgeDimGroup = {
            all: () => {
                return this.filteredData["age"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.AgeBandDimension = {
            filterName: () => "AgeBandDimension",
            filter: (f) => this.dimensionFunction("age_band", f),
            filterAll: () => {},
        };
        this.AgeBandDimGroup = {
            all: () => {
                return this.filteredData["age_band"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.XDimension = {
            filterName: () => "XDimension",
            filter: (f) => this.dimensionFunction("x", f),
            filterAll: () => {},
        };
        this.XDimGroup = {
            all: () => {
                return this.filteredData["x"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.YDimension = {
            filterName: () => "YDimension",
            filter: (f) => this.dimensionFunction("y", f),
            filterAll: () => {},
        };
        this.YDimGroup = {
            all: () => {
                return this.filteredData["y"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.CodeDimension = {
            filterName: () => "CodeDimension",
            filter: (f) => this.dimensionFunction("code", f),
            filterAll: () => {},
        };
        this.CodeDimGroup = {
            all: () => {
                return this.filteredData["code"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.EthnicityDimension = {
            filterName: () => "EthnicityDimension",
            filter: (f) => this.dimensionFunction("ethnicity", f),
            filterAll: () => {},
        };
        this.EthnicityDimGroup = {
            all: () => {
                return this.filteredData["ethnicity"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.SexDimension = {
            filterName: () => "SexDimension",
            filter: (f) => this.dimensionFunction("patient_sex", f),
            filterAll: () => {},
        };
        this.SexDimGroup = {
            all: () => {
                return this.filteredData["patient_sex"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.PillarDimension = {
            filterName: () => "PillarDimension",
            filter: (f) => this.dimensionFunction("pillar", f),
            filterAll: () => {},
        };
        this.PillarDimGroup = {
            all: () => {
                return this.filteredData["pillar"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.ULTADimension = {
            filterName: () => "ULTADimension",
            filter: (f) => this.dimensionFunction("utla", f),
            filterAll: () => {},
        };
        this.ULTADimGroup = {
            all: () => {
                return this.filteredData["utla"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.CareHomeDimension = {
            filterName: () => "CareHomeDimension",
            filter: (f) => this.dimensionFunction("care_home", f),
            filterAll: () => {},
        };
        this.CareHomeDimGroup = {
            all: () => {
                return this.filteredData["care_home"].values;
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
                .json(this.origin.replace("cvi", "results") + "/tpindex/getCrossfilter?filter=" + JSON.stringify(queryFilter), options)
                .then((d: any) => {
                    if (this.filteredData !== d) {
                        this.filteredData = d;
                        this.loadFilters = {};
                        this.myDC.redrawAll();
                        this.map.redraw();
                    }
                });
        }
        return null;
    }

    async redrawCharts(chart: any, dimName: string) {
        chart.filterAll();
        this.getDimensionFromName(dimName).filter(null);
        await this.refresh(this.queryFilter);
    }

    getDimensionFromName(name: string): any {
        const strippedName = name.replace(`"`, "").replace(`"`, "");
        switch (strippedName) {
            case "PillarDimension":
                return this.PillarDimension;
            case "YDimension":
                return this.YDimension;
            case "XDimension":
                return this.XDimension;
            case "DateDimension":
                return this.DateDimension;
            case "UTLADimension":
                return this.ULTADimension;
            case "SexDimension":
                return this.SexDimension;
            case "EthnicityDimension":
                return this.EthnicityDimension;
            case "CodeDimension":
                return this.CodeDimension;
            default:
                return this.CodeDimension;
        }
    }

    resetToWholePop() {
        this.resetBtnPushed = true;
        this.queryFilter = {};
        this.loadFilters = {};
        const header = [["Authorization", "JWT " + this.store.selectSnapshot(AuthState.getToken)]];
        const options: RequestInit = {
            method: "GET",
            headers: header,
        };
        d3.json(this.origin.replace("cvi", "results") + "/tpindex/getCrossfilter", options).then((d: any) => {
            this.filteredData = d;
            this.myDC.filterAll();
            this.myDC.redrawAll();
            this.resetBtnPushed = false;
            this.loadFilters = {};
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

    mapSliderChanged(event) {
        this.mapCircleScalingFactor = event.value;
        this.map.circleScale(this.mapCircleScalingFactor);
        this.map.redraw();
    }

    polySliderChanged(event) {
        this.polyMinOpacity = event.value;
        this.currentZoom = this.mapPoly.getZoom();
        this.currentCentre = this.mapPoly.getCenter();

        if (this.polyIsochrones) {
            this.plotIsochrones();
        } else {
            this.plotScanStats(this.polyCloak ? "cloak" : "rate");
        }

        this.updateColourBar();
    }

    polyMapSliderChanged(event) {
        this.polyMapOpacity = event.value;
        this.currentZoom = this.mapPoly.getZoom();
        this.currentCentre = this.mapPoly.getCenter();

        if (this.polyIsochrones) {
            this.plotIsochrones();
        } else {
            this.plotScanStats(this.polyCloak ? "cloak" : "rate");
        }
    }

    toggleRateChange(event) {
        this.currentZoom = this.mapPoly.getZoom();
        this.currentCentre = this.mapPoly.getCenter();
        this.showRateChange = event.checked;
        this.plotScanStats("rate");
    }

    renderCharts() {
        if (!this.leafletMaprendered) {
            this.map.render();
        }
        // if (this.dateChartOpenCloseAnim === "open") {
        //   this.dateChart.render();
        // }
        if (this.sexChartOpenCloseAnim === "open") {
            this.sexChart.render();
        }
        if (this.pillarChartOpenCloseAnim === "open") {
            this.pillarChart.render();
        }
        if (this.ageChartOpenCloseAnim === "open") {
            this.ageChart.render();
        }
        if (this.ethnicityChartOpenCloseAnim === "open") {
            this.ethnicityChart.render();
        }
        if (this.utlaChartOpenCloseAnim === "open") {
            this.utlaChart.render();
        }
        if (this.careHomeChartOpenCloseAnim === "open") {
            this.careHomeChart.render();
        }
        if (this.datesAndAgeBandHeatmapOpenCloseAnim === "open") {
            this.datesAndAgeBandHeatmap.render();
        }
        // this.myDC.renderAll();
    }

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
        if (details.colsLabel) {
            chart.colsLabel(details.colsLabel);
        }
        if (details.rowsLabel) {
            chart.rowsLabel(details.rowsLabel);
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
                case "scaleBand":
                    chart.x(d3.scaleBand());
                    break;
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
        if (details.titlefunction) {
            chart.title(details.titlefunction);
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
        if (details.cap) {
            chart.cap(details.cap);
        }
        chart.filterHandler((dim, filters) => this.filterHandled(dim, filters));
        chart.commitHandler(async () => {
            await this.refresh(this.queryFilter);
        });
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

    onChartCollapse(type) {
        switch (type) {
            case "ageChart":
                this.ageChartOpenCloseAnim = this.ageChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.ageChartOpenCloseAnim, type);
                break;
            case "ethnicityChart":
                this.ethnicityChartOpenCloseAnim = this.ethnicityChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.ethnicityChartOpenCloseAnim, type);
                break;
            case "sexChart":
                this.sexChartOpenCloseAnim = this.sexChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.sexChartOpenCloseAnim, type);
                break;
            case "careHomeChart":
                this.careHomeChartOpenCloseAnim = this.careHomeChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.careHomeChartOpenCloseAnim, type);
                break;
            case "pillarChart":
                this.pillarChartOpenCloseAnim = this.pillarChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.pillarChartOpenCloseAnim, type);
                break;
            case "utlaChart":
                this.utlaChartOpenCloseAnim = this.utlaChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.utlaChartOpenCloseAnim, type);
                break;
            case "dateChart":
                this.dateChartOpenCloseAnim = this.dateChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.dateChartOpenCloseAnim, type);
                break;
            case "datesAndAgeBandHeatmap":
                this.datesAndAgeBandHeatmapOpenCloseAnim = this.datesAndAgeBandHeatmapOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.datesAndAgeBandHeatmapOpenCloseAnim, type);
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

    downloadData() {
        let options;
        const data = this.dataSource.data;
        this.csvData = [];
        if (this.polyRateLSOA) {
            data.forEach((d) => {
                if (!d.properties.district_boundary) {
                    this.csvData.push({
                        area: d.properties.area,
                        la: d.properties.la,
                        crude_rate: d.properties.crude_rate,
                        crude_rate_per_thousand: d.properties.crude_rate_per_thousand,
                        lower_ci: d.properties.lowercl,
                        upper_ci: d.properties.uppercl,
                        positives: d.properties.positives,
                        count_in_care_home: d.properties.count_in_care_home,
                        care_home_ratio: d.properties.care_home_ratio,
                        n_weeks: this.n_weeks.toString(),
                        start_date: this.formatDate(this.crudeRateDateStart),
                        end_date: this.formatDate(this.crudeRateDateEnd),
                        crude_rate_difference: d.properties.rate_diff,
                        previous_crude_rate: d.properties.previous_crude_rate_per_thousand,
                        previous_positives: d.properties.previous_cases,
                        previous_start_date: this.formatDate(this.addDays(this.crudeRateDateStart, -this.n_weeks * 7)),
                        previous_end_date: this.formatDate(this.addDays(this.crudeRateDateEnd, -this.n_weeks * 7)),
                    });
                }
            });

            options = {
                title: "Rates By Geography",
                fieldSeparator: ",",
                quoteStrings: `"`,
                decimalseparator: ".",
                showLabels: true,
                showTitle: true,
                useBom: true,
                headers: [
                    "Area",
                    "Local Authority",
                    "Crude Rate (per 100 000)",
                    "7-day Average Crude Rate (per 100 000)",
                    "Lower 95% CI [7-day Average Crude Rate (per 100 000)]",
                    "Upper 95% CI [7-day Average Crude Rate (per 100 000)]",
                    "Number of Positives",
                    "Number of Positives Within Care Homes",
                    "Proportions of Positives Within Care Homes [%]",
                    "Number of Weeks",
                    "Start Date [yyyy-mm-dd]",
                    "End Date [yyyy-mm-dd]",
                    "7-day Average Crude Rate Difference",
                    "Previous 7-day Average Crude Rate (per 100 000)",
                    "Previous Number of Positives",
                    "Previous Start Date [yyyy-mm-dd]",
                    "Previous End Date [yyyy-mm-dd]",
                ],
            };
        } else if (this.polyRateMSOA) {
            data.forEach((d) => {
                if (!d.properties.district_boundary) {
                    this.csvData.push({
                        area: d.properties.area,
                        msoa_code: d.properties.msoa_code,
                        la: d.properties.la,
                        crude_rate: d.properties.crude_rate,
                        crude_rate_per_thousand: d.properties.crude_rate_per_thousand,
                        lower_ci: d.properties.lowercl,
                        upper_ci: d.properties.uppercl,
                        positives: d.properties.positives,
                        count_in_care_home: d.properties.count_in_care_home,
                        care_home_ratio: d.properties.care_home_ratio,
                        n_weeks: this.n_weeks.toString(),
                        start_date: this.formatDate(this.crudeRateDateStart),
                        end_date: this.formatDate(this.crudeRateDateEnd),
                        crude_rate_difference: d.properties.rate_diff,
                        previous_crude_rate: d.properties.previous_crude_rate_per_thousand,
                        previous_positives: d.properties.previous_cases,
                        previous_start_date: this.formatDate(this.addDays(this.crudeRateDateStart, -this.n_weeks * 7)),
                        previous_end_date: this.formatDate(this.addDays(this.crudeRateDateEnd, -this.n_weeks * 7)),
                    });
                }
            });

            options = {
                title: "Rates By Geography",
                fieldSeparator: ",",
                quoteStrings: `"`,
                decimalseparator: ".",
                showLabels: true,
                showTitle: true,
                useBom: true,
                headers: [
                    "Area",
                    "MSOA Code",
                    "Local Authority",
                    "Crude Rate (per 100 000)",
                    "7-day Average Crude Rate (per 100 000)",
                    "Lower 95% CI [7-day Average Crude Rate (per 100 000)]",
                    "Upper 95% CI [7-day Average Crude Rate (per 100 000)]",
                    "Number of Positives",
                    "Number of Positives Within Care Homes",
                    "Proportions of Positives Within Care Homes [%]",
                    "Number of Weeks",
                    "Start Date [yyyy-mm-dd]",
                    "End Date [yyyy-mm-dd]",
                    "7-day Average Crude Rate Difference",
                    "Previous 7-day Average Crude Rate (per 100 000)",
                    "Previous Number of Positives",
                    "Previous Start Date [yyyy-mm-dd]",
                    "Previous End Date [yyyy-mm-dd]",
                ],
            };
        } else if (this.polyRateWard) {
            data.forEach((d) => {
                if (!d.properties.district_boundary) {
                    this.csvData.push({
                        area: d.properties.area,
                        code: d.properties.code,
                        la: d.properties.la,
                        crude_rate: d.properties.crude_rate,
                        crude_rate_per_thousand: d.properties.crude_rate_per_thousand,
                        lower_ci: d.properties.lowercl,
                        upper_ci: d.properties.uppercl,
                        positives: d.properties.positives,
                        count_in_care_home: d.properties.count_in_care_home,
                        care_home_ratio: d.properties.care_home_ratio,
                        n_weeks: this.n_weeks.toString(),
                        start_date: this.formatDate(this.crudeRateDateStart),
                        end_date: this.formatDate(this.crudeRateDateEnd),
                        crude_rate_difference: d.properties.rate_diff,
                        previous_crude_rate: d.properties.previous_crude_rate_per_thousand,
                        previous_positives: d.properties.previous_cases,
                        previous_start_date: this.formatDate(this.addDays(this.crudeRateDateStart, -this.n_weeks * 7)),
                        previous_end_date: this.formatDate(this.addDays(this.crudeRateDateEnd, -this.n_weeks * 7)),
                    });
                }
            });

            options = {
                title: "Rates By Geography",
                fieldSeparator: ",",
                quoteStrings: `"`,
                decimalseparator: ".",
                showLabels: true,
                showTitle: true,
                useBom: true,
                headers: [
                    "Electoral Ward",
                    "Ward Code",
                    "Local Authority",
                    "Crude Rate (per 100 000)",
                    "7-day Average Crude Rate (per 100 000)",
                    "Lower 95% CI [7-day Average Crude Rate (per 100 000)]",
                    "Upper 95% CI [7-day Average Crude Rate (per 100 000)]",
                    "Number of Positives",
                    "Number of Positives Within Care Homes",
                    "Proportions of Positives Within Care Homes [%]",
                    "Number of Weeks",
                    "Start Date [yyyy-mm-dd]",
                    "End Date [yyyy-mm-dd]",
                    "7-day Average Crude Rate Difference",
                    "Previous 7-day Average Crude Rate (per 100 000)",
                    "Previous Number of Positives",
                    "Previous Start Date [yyyy-mm-dd]",
                    "Previous End Date [yyyy-mm-dd]",
                ],
            };
        } else {
            data.forEach((d) => {
                this.csvData.push({
                    area: d.properties.area,
                    crude_rate: d.properties.crude_rate,
                    crude_rate_per_thousand: d.properties.crude_rate_per_thousand,
                    lower_ci: d.properties.lowercl,
                    upper_ci: d.properties.uppercl,
                    positives: d.properties.positives,
                    count_in_care_home: d.properties.count_in_care_home,
                    care_home_ratio: d.properties.care_home_ratio,
                    n_weeks: this.n_weeks.toString(),
                    start_date: this.formatDate(this.crudeRateDateStart),
                    end_date: this.formatDate(this.crudeRateDateEnd),
                    crude_rate_difference: d.properties.rate_diff,
                    previous_crude_rate: d.properties.previous_crude_rate_per_thousand,
                    previous_positives: d.properties.previous_cases,
                    previous_start_date: this.formatDate(this.addDays(this.crudeRateDateStart, -this.n_weeks * 7)),
                    previous_end_date: this.formatDate(this.addDays(this.crudeRateDateEnd, -this.n_weeks * 7)),
                });
            });

            options = {
                title: "Rates By Geography",
                fieldSeparator: ",",
                quoteStrings: `"`,
                decimalseparator: ".",
                showLabels: true,
                showTitle: true,
                useBom: true,
                headers: [
                    "Area",
                    "Crude Rate (per 100 000)",
                    "7-day Average Crude Rate (per 100 000)",
                    "Lower 95% CI [7-day Average Crude Rate (per 100 000)]",
                    "Upper 95% CI [7-day Average Crude Rate (per 100 000)]",
                    "Number of Positives",
                    "Number of Positives Within Care Homes",
                    "Proportions of Positives Within Care Homes [%]",
                    "Number of Weeks",
                    "Start Date [yyyy-mm-dd]",
                    "End Date [yyyy-mm-dd]",
                    "7-day Average Crude Rate Difference",
                    "Previous 7-day Average Crude Rate (per 100 000)",
                    "Previous Number of Positives",
                    "Previous Start Date [yyyy-mm-dd]",
                    "Previous End Date [yyyy-mm-dd]",
                ],
            };
        }

        const csvName = "CrudeRateByGeography.csv";

        new Angular2Csv(this.csvData, csvName, options);
    }

    downloadTimeline() {
        const csvName = "PositiveCasesTimeline.csv";
        const options = {
            title: "COVID-19 Positive Cases By Date",
            fieldSeparator: ",",
            quoteStrings: `"`,
            decimalseparator: ".",
            showLabels: true,
            showTitle: true,
            useBom: true,
            headers: ["Date", "COVID-19 Positive Cases"],
        };
        new Angular2Csv(this.DateDimGroup.all(), csvName, options);
    }

    weeksBetween(date1, date2) {
        return Math.abs((date2 - date1) / (7 * this.oneDay));
    }

    daysBetweenDates(firstDate, secondDate) {
        return Math.round(Math.abs((firstDate - secondDate) / this.oneDay));
    }
}

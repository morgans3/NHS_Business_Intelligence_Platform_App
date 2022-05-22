import { Component, OnInit, ElementRef, ViewChild, HostListener } from "@angular/core";
import { collapseAnimations } from "../../../../shared/animations";
import * as dcFull from "dc";
import * as d3 from "d3";
import { Store } from "@ngxs/store";
import { MatDialog } from "@angular/material/dialog";
import { StatCardData } from "./stat-card.component";
import { LeafletChoroplethChart, BarChart, RowChart, FeatureCollection, APIService } from "diu-component-library";
import { AuthState } from "../../../../_states/auth.state";
import { ExpandTextDialogComponent } from "../../_modals/dialogexpand";
import { environment } from "src/environments/environment";
declare let leafletChoroplethChart: any;
declare let leafletLegend: any;
declare let window: any;

// TODO: is this component used?

@Component({
    selector: "app-Regional",
    templateUrl: "./Regional.component.html",
    animations: [collapseAnimations],
})
export class RegionalComponent implements OnInit {
    /* #region Global Variables */
    resetBtnPushed = false;
    loadFilters = {};
    token: string;
    @ViewChild("ewChartParent") ewChartParent: ElementRef;
    @ViewChild("rlChartParent") rlChartParent: ElementRef;
    @ViewChild("ageChartParent") ageChartParent: ElementRef;
    @ViewChild("supportChartParent") supportChartParent: ElementRef;
    dataLoaded = false;
    ndx: any;
    nhs_lad_code: any;
    nhs_lad_codeGroup: any;
    received_letter: any;
    received_letterGroup: any;
    medical_conditions: any;
    medical_conditionsGroup: any;
    can_you_get_essential_supplies_delivered: any;
    can_you_get_essential_supplies_deliveredGroup: any;
    myDC: any;
    all: any;
    ewChart: any;
    ewmapChartDetails: LeafletChoroplethChart;
    ewChartOpenCloseAnim = "open";
    leafletMapRenderedWard = false;
    rlSelect: dc.SelectMenu;
    suppliesSelect: dc.SelectMenu;
    mcSelect: dc.SelectMenu;
    ageChart: any;
    ageChartDetails: BarChart;
    ageChartOpenCloseAnim = "close";
    supportChart: any;
    supportChartDetails: RowChart;
    supportChartOpenCloseAnim = "close";

    TotalPopulation: any;
    CustBaseline: any;
    TotalSelected: any;
    PercentSelected: any;
    patientsCount: any;
    customBaseline = null;
    selectedPopulation = 0;
    keyToolTip: any;
    filteredData: any;
    queryFilter: any = {};
    lastQueryFilter: any = {};
    totalsize: number;
    wards: FeatureCollection;
    refocused = true;

    icpPopulation: StatCardData = {
        title: "Vulnerable Population",
        value: "TotalPopulation",
        subvalue: "Tested",
        icon: "group",
        color: "bg-warning",
    };
    customPopulation: StatCardData = {
        title: "Custom Population",
        value: "CustBaseline",
        subvalue: "CustomTested",
        icon: "face",
        color: "bg-danger",
    };
    selectedPop: StatCardData = {
        title: "Selected Population",
        value: "TotalSelected",
        subvalue: "SelectedTested",
        icon: "group_add",
        color: "bg-success",
    };
    selected: StatCardData = {
        title: "% SELECTED (Total | Custom)",
        value: "PercentSelected",
        subvalue: "PercentTested",
        icon: "pie_chart",
        color: "bg-primary",
    };
    origin: any;
    /* #endregion */

    @HostListener("window:resize", ["$event"])
    onResize() {
        setTimeout(() => {
            this.drawCharts();
        }, 0);
    }

    constructor(public store: Store, public dialog: MatDialog, private sqlService: APIService) {
        this.token = this.store.selectSnapshot(AuthState.getToken);
        const parsedUrl = window.location.href;
        this.origin = parsedUrl.replace("/population-health", "");
        if (this.origin.includes("localhost")) {
            this.origin = "https://www." + environment.websiteURL;
        }
    }

    ngOnInit() {
        const tooltip_remove = d3.select("mat-sidenav-content").selectAll(".tooltip");
        tooltip_remove.remove();
        this.sqlService.getWards().subscribe((data: FeatureCollection[]) => {
            this.wards = data[0];
        });
        this.keyToolTip = d3.select("mat-sidenav-content").append("div").attr("class", "tooltip").style("opacity", 0);
        this.myDC = dcFull;
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
        this.nhs_lad_code = {
            filterName: () => "nhs_lad_code",
            filter: (f) => {
                this.dimensionFunction("nhs_lad_code", f);
                this.refresh(this.queryFilter);
            },
            filterAll: () => {},
        };
        this.nhs_lad_codeGroup = {
            all: () => {
                return this.filteredData["nhs_lad_code"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.received_letter = {
            filterName: () => "received_letter",
            filter: (f) => {
                this.dimensionFunction("received_letter", f);
                this.refresh(this.queryFilter);
            },
            filterAll: () => {},
        };
        this.received_letterGroup = {
            all: () => {
                return this.filteredData["received_letter"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.medical_conditions = {
            filterName: () => "medical_conditions",
            filter: (f) => {
                this.dimensionFunction("medical_conditions", f);
                this.refresh(this.queryFilter);
            },
            filterAll: () => {},
        };
        this.medical_conditionsGroup = {
            all: () => {
                return this.filteredData["medical_conditions"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.can_you_get_essential_supplies_delivered = {
            filterName: () => "can_you_get_essential_supplies_delivered",
            filter: (f) => {
                this.dimensionFunction("can_you_get_essential_supplies_delivered", f);
                this.refresh(this.queryFilter);
            },
            filterAll: () => {},
        };
        this.can_you_get_essential_supplies_deliveredGroup = {
            all: () => {
                return this.filteredData["can_you_get_essential_supplies_delivered"].values;
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
            // TODO: What cf-api does it call?
            await d3
                .json(this.origin.replace("www", "mosaic") + "/dataset/getCrossfilter?filter=" + JSON.stringify(queryFilter), options)
                .then((d) => {
                    if (this.filteredData !== d) {
                        this.filteredData = d;
                        this.myDC.redrawAll();
                        this.ewChart.redraw();
                        this.rlSelect.redraw();
                        this.mcSelect.redraw();
                        this.suppliesSelect.redraw();
                        this.loadFilters = {};
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
        d3.json(this.origin.replace("cvi", "mosaic") + "/people/getCrossfilter", options).then((d) => {
            this.filteredData = d;
            this.myDC.filterAll();
            this.myDC.redrawAll();
            this.ewChart.redraw();
            this.rlSelect.redraw();
            this.mcSelect.redraw();
            this.suppliesSelect.redraw();
            this.resetBtnPushed = false;
            this.loadFilters = {};
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
        if (this.wards) {
            this.createEWMap(this.nhs_lad_code, this.nhs_lad_codeGroup);
        }
        this.rlSelect = this.myDC.selectMenu("#rl-select");
        this.rlSelect.dimension(this.received_letter).group(this.received_letterGroup).controlsUseVisibility(true);
        this.rlSelect.filterHandler((dim, filters) => this.filterHandled(dim, filters));
        this.mcSelect = this.myDC.selectMenu("#mc-select");
        this.mcSelect.dimension(this.medical_conditions).group(this.medical_conditionsGroup).controlsUseVisibility(true);
        this.mcSelect.filterHandler((dim, filters) => this.filterHandled(dim, filters));
        this.suppliesSelect = this.myDC.selectMenu("#supplies-select");
        this.suppliesSelect
            .dimension(this.can_you_get_essential_supplies_delivered)
            .group(this.can_you_get_essential_supplies_deliveredGroup)
            .controlsUseVisibility(true);
        this.suppliesSelect.filterHandler((dim, filters) => this.filterHandled(dim, filters));
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
        chart.filterAll();
        this.getDimensionFromName(dimName).filter(null);
        await this.refresh(this.queryFilter);
    }

    /* #region Header Values and Dropdown functions */
    updateSummaries() {
        const list = this.myDC.chartRegistry.list();
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
        this.rlSelect.render();
        this.mcSelect.render();
        this.suppliesSelect.render();
    }

    /* #region Chart Settings functions */
    createEWMap(dimension: any, group: any) {
        this.ewmapChartDetails = {
            name: "ewChart",
            title: "Electoral Ward",
            dim: dimension,
            group,
            type: "choropleth",
            geojson: this.wards,
            mapOptions: {
                zoom: 10,
                center: {
                    lat: 53.838759,
                    lng: -2.909497,
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
    /* #endregion */

    /* #region Chart Sizing Functions */
    onChartCollapse(type) {
        switch (type) {
            case "ewChart":
                this.ewChartOpenCloseAnim = this.ewChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapseMap(this.ewChartOpenCloseAnim, type);
                break;
            case "ageChart":
                this.ageChartOpenCloseAnim = this.ageChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.ageChartOpenCloseAnim, type);
                break;
            case "supportChart":
                this.supportChartOpenCloseAnim = this.supportChartOpenCloseAnim === "open" ? "close" : "open";
                this.collapse(this.supportChartOpenCloseAnim, type);
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
        if (details.cap) {
            chart.cap(details.cap);
        }
        chart.filterHandler((dim, filters) => this.filterHandled(dim, filters));
        chart.commitHandler(async () => {
            await this.refresh(this.queryFilter);
        });
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
                if (typeof theFilter[0] === "object" && chart.anchorName() !== "ltcChart") {
                    usedFilterArray = [theFilter[0][0], theFilter[0][1]];
                } else if (chart.anchorName() === "ltcChart") {
                    theFilter.forEach((element) => {
                        usedFilterArray.push(element);
                    });
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
        await d3.json(this.origin.replace("cvi", "mosaic") + "/people/getCrossfilter?filter=" + cohorturl, options).then((d) => {
            if (this.filteredData !== d) {
                this.filteredData = d;
                this.myDC.redrawAll();
                this.ewChart.redraw();
                this.rlSelect.redraw();
                this.mcSelect.redraw();
                this.suppliesSelect.redraw();
                this.queryFilter = JSON.parse(cohorturl);
                this.loadFilters = {};
            }
        });
    }

    getDimensionFromName(name: string): any {
        const strippedName = name.replace(`"`, "").replace(`"`, "");
        switch (strippedName) {
            case "nhs_lad_code":
                return this.nhs_lad_code;
            case "received_letter":
                return this.received_letter;
            default:
                return this.nhs_lad_code;
        }
    }

    convertChartToDim(chartname) {
        switch (chartname) {
            case "ewChart":
                return "nhs_lad_code";
            case "rlChart":
                return "received_letter";
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
}

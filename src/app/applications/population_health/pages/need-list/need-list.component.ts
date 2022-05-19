import { Component, ViewChild, ElementRef } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";
import * as d3_test from "d3";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { ToastrService } from "ngx-toastr";
import { JoyrideService } from "ngx-joyride";
import { Subject } from "rxjs";
import { Store } from "@ngxs/store";
import { AuthState } from "../../../../_states/auth.state";
import { APIService } from "diu-component-library";
import { decodeToken } from "../../../../_pipes/functions";
import { CohortService } from "../../_services/cohort-service";
declare let window: any;

@Component({
    selector: "app-need-list",
    templateUrl: "./need-list.component.html",
    styleUrls: ["./need-list.component.scss"],
})
export class NeedListComponent {
    @ViewChild("div_template") plotareaParent: ElementRef;
    @ViewChild("diagnostic_div") logistic_roc_pr_Parent: ElementRef;
    @ViewChild("variable_importance_div") logistic_var_imp_Parent: ElementRef;
    @ViewChild("count_diagnostic_div") count_hist_Parent: ElementRef;
    @ViewChild("scatterplot_div") scatter_Parent: ElementRef;
    @ViewChild("expansion_panel") expansion_panel_Parent: ElementRef;
    sortMethod: String;
    // Array to save model JSONs
    response = [];
    count_diagnostics = [];
    roc_diagnostics = [];
    pr_diagnostics = [];
    variable_importance = [];
    public response_message: string;
    // Booleans for: modelling logistic variable(s)/count variable(s)
    //               modelling count variable/cost variable
    //               plotting histograms on log scale vs linear scale
    ltcDiv = true;
    cost_scatter = false;
    log_scale = false;
    // Array to store desired variables for model run
    use_cohort = [];
    use_response = [];
    use_predict = [];
    use_area = [];
    // Long-term condition array
    response_variable = [
        "Asthma",
        "Coronary Artery Disease",
        "Congestive Heart Failure",
        "Cancer",
        "COPD",
        "Depression",
        "Diabetes",
        "Hypertension",
        "Atrial Fibrillation",
        "Chronic Kidney Disease",
        "Dementia",
        "Epilepsy",
        "Hypothyroid",
        "Mental Health",
        "Learning Disability",
        "Osteoporosis",
        "Peripheral Artery Disease",
        "Rheumatoid Arthritis",
        "Stroke/TIA",
        "Total Medical Cost [£]",
        "AE Attendances",
        "Outpatient Appointments",
        "Inpatient Appointments",
    ];
    response_variableCopy: string[] = [];
    // Predictor variable array
    predictors = [
        "Age",
        "Age Band",
        "Sex",
        "Deprivation Decile",
        "Number of Other Long-Term Conditions",
        "Average Days Between Appointments",
        "Smoking History",
        "Substance Misuse",
        "Psychotic Disorder",
        "Mosaic Label",
        "Asthma",
        "Coronary Artery Disease",
        "Congestive Heart Failure",
        "Cancer",
        "COPD",
        "Depression",
        "Diabetes",
        "Hypertension",
        "Atrial Fibrillation",
        "Chronic Kidney Disease",
        "Dementia",
        "Epilepsy",
        "Hypothyroid",
        "Mental Health",
        "Learning Disability",
        "Osteoporosis",
        "Peripheral Artery Disease",
        "Rheumatoid Arthritis",
        "Stroke/TIA",
        "Total Medical Cost [£]",
        "AE Attendances",
        "Outpatient Appointments",
        "Inpatient Appointments",
        "Palliative Care Status",
        "Care Home Status",
        "Frailty",
    ];
    ccg_list = ["Fylde and Wyre CCG", "Blackpool CCG"];
    cohort_array: any;
    cohort_names = []; // ['Cohort Young/Female/Hypertension'];
    // Area grouping array
    area = ["Ward", "GP Practice", "Primary Care Network", "CCG", "County"];
    training_groups = [
        {
            name: "Blackpool CCG",
            disabled: false,
            area: [
                "Blackpool CCG",
                "Blackpool Central West - Blackpool CCG",
                "Central - Blackpool CCG",
                "North - Blackpool CCG",
                "Other PCN - Blackpool CCG",
                "South - Blackpool CCG",
                "WIN - Blackpool CCG",
            ],
        },
        {
            name: "Fylde and Wyre CCG",
            disabled: false,
            area: [
                "Fylde and Wyre CCG",
                "WREN - F and W CCG",
                "WIN - F and W CCG",
                "Fleetwood - F and W CCG",
                "Lytham, Ansdell and St Annes - F and W CCG",
            ],
        },
    ];
    loading = new Subject<boolean>();
    // Initial plot variable definitions
    private margin = { top: 20, right: 20, bottom: 50, left: 100 };
    private height: number;
    private width: number;
    private x: any;
    private x1: any;
    private x2: any;
    private y: any;
    private svg: any;
    private g: any;
    private line: any;
    private tooltip: any;
    private roc_pr_height: number;
    private roc_pr_width: number;
    public roc_pr_x: any;
    public roc_pr_y: any;
    private roc_pr_svg: any;
    private roc_pr_g: any;
    private roc_pr_line: any;
    private focus: any;
    private var_imp_x: any;
    private var_imp_y: any;
    private var_imp_svg: any;
    private var_imp_g: any;
    private var_imp_bar: any;
    private var_imp_width: any;
    private var_imp_height: any;
    private hist_margin = { top: 20, right: 20, bottom: 40, left: 80 };
    private hist_height: number;
    private hist_width: number;
    public hist_x: any;
    public hist_y: any;
    private hist_svg: any;
    private hist_g: any;
    private hist_bar: any;
    private hist_line: any;
    private scatter_x: any;
    private scatter_y: any;
    private scatter_svg: any;
    private scatter_g: any;
    private scatter_point: any;
    private scatter_width: any;
    private scatter_height: any;
    private binwidth = 2;
    private tokenDecoded: any;
    selected_ccg = this.ccg_list;
    selected_training = this.training_groups["area"];
    minData = true;
    gpNameLookup: { code: string; name: string }[] = [];

    constructor(
        public http: HttpClient,
        private toastr: ToastrService,
        private apiService: APIService,
        private cohortsService: CohortService,
        private readonly joyrideService: JoyrideService,
        private store: Store
    ) {
        const parsedUrl = window.location.href;
        const tooltip_remove = d3.select("mat-sidenav-content").selectAll(".tooltip");
        tooltip_remove.selectAll("*").remove();
        this.response_variable.forEach((elem) => this.response_variableCopy.push(elem));
        this.apiService.getGPPractices().subscribe((data: any) => {
            this.gpNameLookup = [];
            data[0].features.forEach((row) => {
                this.gpNameLookup.push({
                    code: row.properties.Code,
                    name: row.properties.Name,
                });
            });
        });
    }

    minDataset() {
        if (this.use_area.length > 0 && this.use_response.length > 0 && this.use_predict.length > 0) {
            return false;
        }
        return true;
    }

    allow_model() {
        if (this.use_area.length > 0 && this.use_response.length > 0 && this.use_predict.length > 0) {
            this.minData = false;
        } else {
            this.minData = true;
        }
    }

    // If the user filters to a specific area, then don't allow them to train
    //   any models on other areas' datasets
    disable_training() {
        this.training_groups.forEach((d) => {
            if (this.selected_ccg.indexOf(d.name) > -1) {
                d.disabled = false;
            } else {
                d.disabled = true;
            }
        });
    }

    backtoGroup(item) {
        if (this.response_variableCopy.includes(item)) {
            this.response_variable.push(item);
        } else {
            this.predictors.push(item);
        }
    }

    showGuide() {
        this.joyrideService.startTour({
            steps: ["needs0", "needs1", "needs2", "needs3", "needs4", "needs5", "needs6", "needs7", "needs8"],
        });
    }

    // Warning pop-up if user puts too many items into a box
    n_variable_toaster(toast_message: string, n: number) {
        this.toastr.show("", "Please Select " + n + " " + toast_message + " Only.");
    }

    // Warning pop-up if user doesn't put any items into a box
    too_few_variables_toaster(toast_message: string) {
        this.toastr.show("", "Please Select At Least One " + toast_message + ".");
    }

    // Warning pop-up if user tries to use both AGE and AGE-BAND in the model
    two_age_variables_toaster(toast_message: string) {
        this.toastr.show("", "Two Age Groupings Selected, Using Only " + toast_message + ".");
    }

    // Warning pop-up if there's an error in the R-script
    r_error_toaster() {
        this.toastr.show("", this.response_message);
    }

    // Warning pop-up if there's an error in the request (e.g. a 503 response)
    server_error_toaster(error_status: string) {
        this.toastr.show(
            "If The Problem Persists Then Contact A Nexus Intelligence Admin.",
            "Warning, " + error_status + " Error. Please Wait A Few Seconds And Try Again.",
            { timeOut: 3000 }
        );
    }

    // Drag/drop into a box which can have all items within it
    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
        this.minData = this.minDataset();
    }

    // Drag/drop into a box which can have up to n variables within it
    n_drop(event: CdkDragDrop<string[]>, message: string, n: number) {
        if (event.container.data.length > n - 1) {
            // Send warning message
            this.n_variable_toaster(message, n);

            if (event.currentIndex === 0) {
                transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

                transferArrayItem(event.container.data, event.previousContainer.data, event.currentIndex + 1, event.previousIndex);
            } else {
                transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

                transferArrayItem(event.container.data, event.previousContainer.data, event.currentIndex - 1, event.previousIndex);
            }
        } else {
            if (event.previousContainer === event.container) {
                moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            } else {
                transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
            }
        }
        this.minData = this.minDataset();
    }

    /**
     *
     *  Code to use the drag/drop lists to send an API call to plumbeR.
     *  The model is run in R and returned as a JSON, which is plotted.
     *
     */

    // Loading boolean for waiting on the API call
    show() {
        this.loading.next(true);
    }

    hide() {
        this.loading.next(false);
    }

    // Save response data and plot
    get_data = function (response) {
        this.hide();
        this.response_message = response.message;
        this.response = response.model_match;
        if (this.ltcDiv) {
            this.pr_diagnostics = response.diagnostics.pr;
            this.roc_diagnostics = response.diagnostics.roc;
            this.variable_importance = response.importance;
            this.roc_diagnostics.sort((a, b) => {
                return a.false_positive - b.false_positive;
            });

            this.pr_diagnostics.sort((a, b) => {
                return a.recall - b.recall;
            });

            this.variable_importance.sort((a, b) => {
                return a.importance - b.importance;
            });
            this.plot_logistic_diagnostics();
        } else {
            this.count_diagnostics = response.diagnostics;
            this.plot_count_diagnostics("log");
        }

        this.sort_by_method();
    };

    get_cohort_name(str) {
        return str.split("Cohort ")[1];
    }

    // Send API call to plumbeR
    send_api() {
        // let http_request = this.origin + "modelledneed/logistic_model_api?";
        let http_request = "https://need.nexusintelligencenw.nhs.uk/modelled_needs_api?";

        // let http_request = "http://localhost:8092/modelled_needs_api?";

        // Check at least one item is in each box before sending call
        if (this.use_response[0] === null) {
            this.too_few_variables_toaster("Response Variable");
        } else if (this.use_area[0] === null) {
            this.too_few_variables_toaster("Area Grouping");
        } else if (this.use_predict[0] === null) {
            this.too_few_variables_toaster("Predictor Variable");
        } else {
            if (this.use_predict.indexOf("Age") !== -1 && this.use_predict.indexOf("Age Band") !== -1) {
                // If Age and Age-Band are chosen as predictors then default to age band
                this.two_age_variables_toaster("Age Band");

                const index: number = this.use_predict.indexOf("Age");
                this.use_predict.splice(index, 1);
                this.predictors.push("Age");
            }
            // Create cURL string
            // Add area grouping
            let flag = false;
            this.use_area.forEach(function (d, i) {
                http_request = http_request + "area_level=" + d;
                if (d === "GP Practice") {
                    flag = true;
                }
            });

            // Add Response Variable(s)
            if (this.use_response.toString().includes("Cohort")) {
                const cohort = this.cohort_array.filter((x) => "Cohort " + x.cohortName === this.use_response.toString());

                if (cohort.length > 0) {
                    http_request = http_request + "&response_filter_1=" + JSON.stringify(cohort[0].cohorturl);
                }
            } else {
                this.use_response.forEach(function (d, i) {
                    http_request = http_request + "&response_filter_" + (i + 1) + "=" + d;
                });
            }

            // Add Predictor Variable(s)
            this.use_predict.forEach(function (d, i) {
                http_request = http_request + "&group_" + (i + 1) + "=" + d;
            });

            // Add age grouping flag
            if (this.use_predict.indexOf("Age Band") !== -1) {
                http_request = http_request + "&age_as_a_factor=Y";
            }

            // Add CCG filtering (filter training set to specified area)
            if (this.selected_ccg) {
                http_request = http_request + "&filter_to_area=" + this.selected_ccg;
            }

            // Add CCG filtering (filter training set to specified area)
            if (this.selected_training) {
                http_request = http_request + "&train_on_area=" + this.selected_training;
            }

            // Display loading spinner
            this.show();

            // Set flags depending on model desired
            if (this.use_response.includes("Total Medical Cost [£]")) {
                this.ltcDiv = false;
                this.cost_scatter = true;
            } else if (
                this.use_response.includes("AE Attendances") ||
                this.use_response.includes("Outpatient Appointments") ||
                this.use_response.includes("Inpatient Appointments")
            ) {
                this.ltcDiv = false;
                this.cost_scatter = false;
            } else {
                this.ltcDiv = true;
                this.cost_scatter = false;
            }

            // Send API call and save/plot returned data
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
                        if (flag) {
                            res.body.model_match.forEach((element) => {
                                const code = element["area_var"];
                                const gp = this.gpNameLookup.find((x) => x.code === code);
                                if (gp) {
                                    element["area_var"] = gp.name;
                                }
                            });
                        }

                        if (res.status.toString().startsWith("5")) {
                            this.hide();
                            this.server_error_toaster(res.status.toString());
                        } else {
                            this.get_data(res.body);
                        }
                    },
                    (error) => {
                        this.hide();
                        this.server_error_toaster("Server");
                    }
                );
        }
    }

    /**
     *
     *   Code to plot output of API call
     *
     */

    // Make the barplot, sorted by whichever method is desired
    sort_by_method(sort_method: string) {
        this.sortMethod = sort_method;
        this.init_svg();
        this.init_axis();

        switch (sort_method) {
            case "ratio":
                this.response.sort(function (a, b) {
                    return d3_test.ascending(a.match_ratio, b.match_ratio);
                });
                break;
            case "significance":
                this.response.sort(function (a, b) {
                    return d3_test.ascending(a.significance, b.significance);
                });
                break;
            default:
                this.response.sort(function (a, b) {
                    return d3_test.descending(a.area_var, b.area_var);
                });
                break;
        }

        this.y.domain(this.response.map((d) => d.area_var));

        this.draw_bars();
        this.draw_line();
        this.draw_axis();
    }

    // Initialise the SVG in which the plot is kept
    private init_svg() {
        // Remove previous plot
        const svg_remove = d3.select("svg");
        svg_remove.selectAll("*").remove();

        // Remove g if browser is Internet Explorer, don't if not
        if (/msie\s|trident\//i.test(window.navigator.userAgent)) {
            const inner_g = d3.select("g").remove();
        }

        const tooltip_remove = d3.select("mat-sidenav-content").selectAll(".tooltip");
        tooltip_remove.remove();

        const box_width = this.plotareaParent.nativeElement.clientWidth - 40;
        let box_height = this.plotareaParent.nativeElement.clientHeight - 40;
        if (box_height < box_width) {
            box_height = box_width * 1.2;
        }

        // Create new plot
        if (this.svg === undefined) {
            d3.select("#div_template").append("svg").attr("class", "plotarea").attr("id", "plotarea");
        }
        this.svg = d3.select(".plotarea");
        this.svg.attr("width", box_width).attr("height", box_height);
        this.width = box_width - 20;
        this.height = box_height - 20;
        this.g = this.svg.append("g").attr("transform", "translate(10," + this.margin.top + ")");
        this.tooltip = d3.select("mat-sidenav-content").append("div").attr("class", "tooltip").style("opacity", 1);
    }

    // Define plot axis lengths
    private init_axis() {
        this.x = d3Scale.scaleLinear().rangeRound([0, this.width]);
        this.y = d3Scale.scaleBand().rangeRound([this.height, 0]).padding(0.1);
        this.y.domain(this.response.map((d) => d.area_var));
        this.x.domain([0, 2]);
    }

    // Draw axes onto the plot
    private draw_axis() {
        // y-axis
        this.g
            .append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + this.width / 2 + ", 0)")
            .call(d3Axis.axisLeft(this.y));

        // Swap y-axis label side for negative values
        this.g
            .selectAll(".tick")
            .data(this.response)
            .select("text")
            .attr("x", (d, i) => (d.match_ratio < 1 ? 9 : -9))
            .style("text-anchor", (d, i) => (d.match_ratio < 1 ? "start" : "end"));

        // x-axis
        this.g
            .append("g")
            .attr("class", "axis axis--x")
            .call(d3Axis.axisTop(this.x).ticks(10, "%"))
            .append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("x", 6)
            .attr("dx", "1em")
            .style("text-anchor", "middle");
    }

    // Draw the bars onto the barplot
    private draw_bars() {
        const bars = this.g
            .selectAll(".bar")
            .data(this.response)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", (d) => this.y(d.area_var))
            .attr("x", (d) => this.x(Math.min(d.match_ratio, 1)))
            .attr("class", (d) => {
                return "bar bar--" + (d.significant === "Yes" ? "outlier" : "normal");
            })
            .attr("class", (d) => {
                return "bar bar--" + (d.significant === "Yes" ? (d.match_ratio < 1 ? "outlier-less" : "outlier-greater") : "normal");
            })
            .attr("stroke", "black")
            .attr("stroke-width", 0.4)
            .attr("height", this.y.bandwidth())
            .attr("width", (d) => this.x(Math.abs(Math.min(d.match_ratio, 2) - 1)));

        bars.on("mouseenter.something", (d, index, array) => this.mouseEnter(d, index, array, "normal")).on("mouseout.something", () =>
            this.mouseLeave()
        );
    }

    mouseEnter(datum: any, index: number, array: any[], tooltip_type: string) {
        const attributes = array[index]["attributes"];
        const x = parseInt(attributes["x"].nodeValue);
        const y = parseInt(attributes["y"].nodeValue);
        const rect = document.getElementById("plotarea").getBoundingClientRect();
        const drawer = document.getElementsByClassName("mat-drawer-content")[0];
        this.tooltip.transition().duration(200).style("opacity", 0.9);

        switch (tooltip_type) {
            case "ROC_PR":
                var html = this.htmlROCTooltip(datum);
                break;
            default:
                html = this.htmlTooltip(datum);
                break;
        }
        this.tooltip
            .html(html)
            .style("left", rect.left + x + "px")
            .style("top", drawer.scrollTop + rect.top + y - 150 + "px");
    }

    htmlTooltip(d: any) {
        // Observed - if cost then round to nearest 100,000 and add £ symbol
        //          - otherwise just round
        let observed;
        if (this.cost_scatter) {
            observed = "£ " + Math.round(d.observed * 1000) * 1000;
        } else {
            observed = Math.round(d.observed);
        }

        let expected;
        if (this.cost_scatter) {
            expected = "£ " + Math.round(d.expected * 1000) * 1000;
        } else {
            expected = Math.round(d.expected);
        }

        let output;
        output = "	<div id='modelledneedToolTip' class='container'>";

        output += "		<div class='row'>";
        output += "<h5>Area: " + d.area_var + "</h5>";
        output += "		</div>";
        output += "		<div class='row'>";
        output += "<h5>Observed: " + observed + "</h5>";
        output += "		</div>";
        output += "		<div class='row'>";
        output += "<h5>Expected: " + expected + "</h5>";
        output += "		</div>";
        output += "		<div>";
        output += "<h5>Observed - Expected Difference: </h5><h5>";
        output +=
            Math.round(100 * (d.match_ratio - 1)) + " &plusmn; " + Math.round((100 * (d.match_higher - d.match_lower)) / 2) + "%</h5>";
        output += "		</div>";

        output += "	</div>";
        return output;
    }

    htmlROCTooltip(d: any) {
        let output;

        output = "	<div id='modelledneedToolTip' class='container'>";
        output += "		<div class='row'>";
        output += "<h5> Area Under the Curve = " + d.auc + "</h5>";
        output += "		</div>";
        output += "		<div class='row'>";
        output += "<h5> False Positive Rate = " + d.false_positive + "</h5>";
        output += "		</div>";
        output += "		<div class='row'>";
        output += "<h5> True Positive Rate = " + d.true_positive + "</h5>";
        output += "		</div>";
        output += "		<div class='row'>";
        output += "<h5> Cutoff = " + d.cutoff + "</h5>";
        output += "		</div>";
        output += " </div>";
        return output;
    }

    mouseLeave() {
        this.tooltip.style("opacity", 0);
    }

    private draw_line() {
        this.line = this.g
            .selectAll(".uncertainty")
            .data(this.response)
            .enter()
            .append("line")
            .attr("class", "line")
            .attr("x1", (d) => this.x(d.match_lower))
            .attr("x2", (d) => this.x(d.match_higher))
            .attr("y1", (d) => this.y(d.area_var) + this.y.bandwidth() / 2)
            .attr("y2", (d) => this.y(d.area_var) + this.y.bandwidth() / 2)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        this.g
            .selectAll(".uncertainty-cap-right")
            .data(this.response)
            .enter()
            .append("line")
            .attr("class", "line")
            .attr("x1", (d) => this.x(d.match_higher))
            .attr("x2", (d) => this.x(d.match_higher))
            .attr("y1", (d) => this.y(d.area_var) + this.y.bandwidth() / 2 - 4)
            .attr("y2", (d) => this.y(d.area_var) + this.y.bandwidth() / 2 + 4)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        this.g
            .selectAll(".uncertainty-cap-left")
            .data(this.response)
            .enter()
            .append("line")
            .attr("class", "line")
            .attr("x1", (d) => this.x(d.match_lower))
            .attr("x2", (d) => this.x(d.match_lower))
            .attr("y1", (d) => this.y(d.area_var) + this.y.bandwidth() / 2 - 4)
            .attr("y2", (d) => this.y(d.area_var) + this.y.bandwidth() / 2 + 4)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    }

    /**
     *  Advanced diagnostics tab for logistic regression models,
     *  showing ROC and precision-recall curves with info
     */

    // Make the barplot, sorted by whichever method is desired
    private plot_logistic_diagnostics(diagnostic_type: string) {
        this.dummy_svg();

        // Create and draw variable importance plot
        this.init_var_imp_svg();
        this.init_var_imp_axis();
        this.draw_var_imp_axis();
        this.draw_var_imp_bars();

        // Create and draw ROC curve OR precision recall curve
        this.init_roc_pr_svg();
        this.init_roc_pr_axis();
        this.draw_roc_pr_axis();

        switch (diagnostic_type) {
            case "PR":
                this.draw_pr_line();
                break;
            default:
                this.draw_roc_line();
                break;
        }
    }

    // Initialise the SVG in which the ROC/PR plot is kept
    private dummy_svg() {
        // Remove previous plot
        const svg_remove = d3_test.select("#dummy_div");
        svg_remove.selectAll("*").remove();

        const box_width = this.plotareaParent.nativeElement.clientWidth - 40;
        let box_height = this.plotareaParent.nativeElement.clientHeight - 40;
        if (box_height < box_width) {
            box_height = box_width * 1.2;
        }

        // Create new plot
        d3.select("#dummy_div").append("svg").attr("id", "dummy_plot").attr("width", box_width).attr("height", box_height);

        const dummy_svg = d3.select("#dummy_plot");
        const dummy_width = box_width - 20; // +this.roc_pr_svg.attr('width') - this.margin.left - this.margin.right;
        const dummy_height = box_height - 200; // +this.roc_pr_svg.attr('height') - this.margin.top - this.margin.bottom;
        const dummy_g = dummy_svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        const dummy_x = d3Scale.scaleLinear().rangeRound([0, dummy_width]);
        const dummy_y = d3Scale.scaleLinear().rangeRound([dummy_height, 0]);
        dummy_x.domain([0, 1]);
        dummy_y.domain([0, 1]);

        // y-axis
        dummy_g.append("g").attr("class", "dummy_axis").call(d3Axis.axisLeft(dummy_y));

        // x-axis
        dummy_g
            .append("g")
            .attr("class", "dummy_axis")
            .attr("transform", "translate(0, " + dummy_height + ")")
            .call(d3Axis.axisBottom(dummy_x));
    }

    // Initialise the SVG in which the ROC/PR plot is kept
    private init_roc_pr_svg() {
        // Remove previous plot
        const svg_remove = d3_test.select("#diagnostic_div");
        svg_remove.selectAll("*").remove();

        const box_width = this.plotareaParent.nativeElement.clientWidth - 40;
        let box_height = this.plotareaParent.nativeElement.clientHeight - 40;
        if (box_height < box_width) {
            box_height = box_width * 1.2;
        }

        // Create new plot
        d3.select("#diagnostic_div").append("svg").attr("id", "diagnostics_plot").attr("width", box_width).attr("height", box_height);

        this.roc_pr_svg = d3.select("#diagnostics_plot");
        this.roc_pr_width = box_width - 20; // +this.roc_pr_svg.attr('width') - this.margin.left - this.margin.right;
        this.roc_pr_height = box_height - 200; // +this.roc_pr_svg.attr('height') - this.margin.top - this.margin.bottom;
        this.roc_pr_g = this.roc_pr_svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    // Define ROC/PR plot axis lengths
    private init_roc_pr_axis() {
        this.roc_pr_x = d3Scale.scaleLinear().rangeRound([0, this.roc_pr_width]);
        this.roc_pr_y = d3Scale.scaleLinear().rangeRound([this.roc_pr_height, 0]);
        this.roc_pr_x.domain([0, 1]);
        this.roc_pr_y.domain([0, 1]);
    }

    // Draw axes onto the ROC/PR plot
    private draw_roc_pr_axis() {
        // y-axis
        this.roc_pr_g
            .append("g")
            .attr("class", "axis axis--y")
            .call(d3Axis.axisLeft(this.roc_pr_y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text("Precision");

        // x-axis
        this.roc_pr_g
            .append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0, " + this.roc_pr_height + ")")
            .call(d3Axis.axisBottom(this.roc_pr_x))
            .append("text")
            .style("text-anchor", "end")
            .style("color", "black")
            .text("Recall");
    }

    // Draw the Receiver Operating Characteristic curve
    private draw_roc_line() {
        const roc_line_position = d3_test
            .line()
            .defined((d: any) => {
                return !isNaN(d.cutoff);
            })
            .x((d: any) => {
                return this.roc_pr_x(d.false_positive);
            })
            .y((d: any) => {
                return this.roc_pr_y(d.true_positive);
            })
            .curve(d3_test.curveBasis);

        const bisect = d3_test.bisector((d: any) => {
            return d.false_positive;
        }).left;
        const bounds = d3_test.extent(this.roc_diagnostics, (d) => d.cutoff);
        const defs = this.roc_pr_svg.append("defs");
        const linear_gradient = defs.append("linearGradient").attr("id", "linear-gradient").attr("x1", bounds[0]).attr("x2", bounds[1]);

        linear_gradient.append("stop").attr("offset", bounds[0]).attr("stop-color", "blue");

        linear_gradient.append("stop").attr("offset", bounds[1]).attr("stop-color", "purple");

        const roc_line = this.roc_pr_g
            .append("path")
            .datum(this.roc_diagnostics)
            .attr("class", "line")
            .attr("d", (p) => roc_line_position(p))
            .attr("stroke", "url(#linear-gradient)")
            .attr("fill", "none");

        // Tooltip for extra info
        this.focus = this.roc_pr_g.append("g").attr("class", "focus").style("display", "none");

        this.focus.append("line").attr("class", "y-hover-line hover-line").attr("x1", 0).attr("x2", this.roc_pr_width);

        this.focus.append("line").attr("class", "x-hover-line hover-line").attr("y1", 0).attr("y2", this.roc_pr_height);

        this.focus.append("circle").attr("r", 7.5);

        this.focus.append("text").attr("x", 15).attr("dy", ".31em");

        this.roc_pr_g
            .append("rect")
            .attr("class", "over")
            .style("opacity", 0)
            .attr("width", this.roc_pr_width)
            .attr("height", this.roc_pr_height)
            /**        .on("mouseenter.something", (d, index, array) =>
          this.mouseEnter(d, index, array, 'ROC_PR')
        )
        .on("mouseout.something", () => this.mouseLeave()); */

            .on("mouseover", () => {
                this.focus.style("display", null);
                this.tooltip.style("opacity", 1);
            })
            .on("mouseout", () => {
                this.focus.style("display", "none");
                this.tooltip.style("opacity", 0);
            })
            .on("mousemove", () => {
                const x0 = this.roc_pr_x.invert(d3_test.event.x - 250);
                const i = bisect(this.roc_diagnostics, x0);
                const d0 = this.roc_diagnostics[i - 1];
                const d1 = this.roc_diagnostics[i];
                const d2 = x0 - d0 > d1 - x0 ? d1 : d0;

                this.focus.attr("transform", "translate(" + this.roc_pr_x(d2.false_positive) + "," + this.roc_pr_y(d2.true_positive) + ")");
                this.tooltip
                    .style("left", d3_test.event.pageX + 15 + "px")
                    .style("top", d3_test.event.pageY - 25 + "px")
                    .html(
                        "<p> Area Under the Curve = " +
                            d2.auc +
                            "</p><br> \
              <p> False Positive Rate = " +
                            d2.false_positive +
                            "</p><br> \
              <p> True Positive Rate = " +
                            d2.true_positive +
                            "</p><br> \
              <p> Cutoff = " +
                            d2.cutoff +
                            "</p>"
                    );

                this.focus.select(".x-hover-line").attr("y2", this.roc_pr_height - this.roc_pr_y(d2.true_positive));
                this.focus.select(".y-hover-line").attr("x2", -this.roc_pr_x(d2.false_positive));
            });
    }

    // Draw the precision-recall line
    private draw_pr_line() {
        const pr_line_position = d3_test
            .line()
            .defined((d: any) => {
                return !isNaN(d.cutoff);
            })
            .x((d: any) => {
                return this.roc_pr_x(d.recall);
            })
            .y((d: any) => {
                return this.roc_pr_y(d.precision);
            })
            .curve(d3_test.curveBasis);

        const bisect = d3_test.bisector((d: any) => {
            return d.recall;
        }).left;
        const bounds = d3_test.extent(this.pr_diagnostics, (d) => d.cutoff);
        const defs = this.roc_pr_svg.append("defs");
        const linear_gradient = defs.append("linearGradient").attr("id", "linear-gradient").attr("x1", bounds[0]).attr("x2", bounds[1]);

        linear_gradient.append("stop").attr("offset", bounds[0]).attr("stop-color", "blue");

        linear_gradient.append("stop").attr("offset", bounds[1]).attr("stop-color", "purple");

        const pr_line = this.roc_pr_g
            .append("path")
            .datum(this.pr_diagnostics)
            .attr("class", "line")
            .attr("d", pr_line_position)
            .attr("stroke", "url(#linear-gradient)")
            .attr("fill", "none");

        this.focus = this.roc_pr_g.append("g").attr("class", "focus").style("display", "none");

        this.focus.append("line").attr("class", "y-hover-line hover-line").attr("x1", 0).attr("x2", this.roc_pr_width);

        this.focus.append("line").attr("class", "x-hover-line hover-line").attr("y1", 0).attr("y2", this.roc_pr_height);

        this.focus.append("circle").attr("r", 7.5);

        this.focus.append("text").attr("x", 15).attr("dy", ".31em");

        this.roc_pr_g
            .append("rect")
            .attr("class", "over")
            .attr("width", this.roc_pr_width)
            .attr("height", this.roc_pr_height)
            .on("mouseover", () => {
                this.focus.style("display", null);
                this.tooltip.style("opacity", 1);
            })
            .on("mouseout", () => {
                this.focus.style("display", "none");
                this.tooltip.style("opacity", 0);
            })
            .on("mousemove", () => {
                const x0 = this.roc_pr_x.invert(d3_test.event.x - 250);
                const i = bisect(this.pr_diagnostics, x0);
                const d0 = this.pr_diagnostics[i - 1];
                const d1 = this.pr_diagnostics[i];
                const d2 = x0 - d0 > d1 - x0 ? d1 : d0;

                this.focus.attr("transform", "translate(" + this.roc_pr_x(d2.recall) + "," + this.roc_pr_y(d2.precision) + ")");
                this.tooltip
                    .style("left", d3_test.event.pageX + 15 + "px")
                    .style("top", d3_test.event.pageY - 25 + "px")
                    .html(
                        "<p> Area Under the Curve = " +
                            d2.auc +
                            "</p><br> \
              <p> Recall = " +
                            d2.recall +
                            "</p><br> \
              <p> Precision = " +
                            d2.precision +
                            "</p><br> \
              <p> Cutoff = " +
                            d2.cutoff +
                            "</p>"
                    );

                this.focus.select(".x-hover-line").attr("y2", this.roc_pr_height - this.roc_pr_y(d2.precision));
                this.focus.select(".y-hover-line").attr("x2", -this.roc_pr_x(d2.recall));
            });
    }

    // Initialise the SVG in which the variable importance plot is kept
    private init_var_imp_svg() {
        // Remove previous plot
        const svg_remove = d3_test.select("#variable_importance_div");
        svg_remove.selectAll("*").remove();

        const box_width = this.plotareaParent.nativeElement.clientWidth - 40;
        let box_height = this.plotareaParent.nativeElement.clientHeight - 40;
        if (box_height < box_width) {
            box_height = box_width * 1.2;
        }

        // Create new plot
        d3.select("#variable_importance_div")
            .append("svg")
            .attr("id", "variable_importance_plot")
            .attr("width", box_width)
            .attr("height", box_height);

        this.var_imp_svg = d3.select("#variable_importance_plot");
        this.var_imp_width = box_width - 20; // +this.var_imp_svg.attr('width') - this.margin.left - this.margin.right;
        this.var_imp_height = box_height - 200; // +this.var_imp_svg.attr('height') - this.margin.top - this.margin.bottom;
        this.var_imp_g = this.var_imp_svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    // Define variable importance plot axis lengths
    private init_var_imp_axis() {
        this.var_imp_x = d3Scale.scaleLinear().rangeRound([0, this.var_imp_width]);
        this.var_imp_y = d3Scale.scaleBand().rangeRound([this.var_imp_height, 0]).padding(0.1);
        this.var_imp_y.domain(this.variable_importance.map((d) => d.model_variable));
        this.var_imp_x.domain([
            0,
            d3_test.max(
                this.variable_importance.map((d) => {
                    return d.importance;
                })
            ),
        ]);
    }

    // Draw axes onto the variable importance plot
    private draw_var_imp_axis() {
        // y-axis
        this.var_imp_g
            .append("g")
            .attr("class", "axis axis--y")
            .call(d3Axis.axisLeft(this.var_imp_y))
            .append("text")
            .attr("y", 0 - this.hist_margin.left)
            .attr("x", 0 - this.hist_height / 2)
            .attr("dy", "4em")
            .attr("dx", "4em")
            .style("text-anchor", "end")
            .style("fill", "black")
            .text("Model Variable");

        this.var_imp_g
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        // x-axis
        this.var_imp_g
            .append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0, " + this.var_imp_height + ")")
            .call(d3Axis.axisBottom(this.var_imp_x).ticks(10))
            .append("text")
            .style("text-anchor", "end")
            .style("color", "black")
            .text("Importance");
    }

    // Draw the bars onto the variable importance barplot
    private draw_var_imp_bars() {
        this.var_imp_g
            .selectAll(".var_bar")
            .data(this.variable_importance)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", (d) => this.var_imp_y(d.model_variable))
            .attr("x", 0)
            .style("fill", "steelblue")
            .attr("height", this.var_imp_y.bandwidth())
            .attr("width", (d) => this.var_imp_x(d.importance));
    }

    /**
     *  Advanced diagnostics tab for poisson regression models,
     *  showing hisogram and scatter plot for expected vs observed
     */

    // Make the barplot, sorted by whichever method is desired
    private plot_count_diagnostics(scale_type: string) {
        this.dummy_svg();

        // Create and draw count density barplot
        this.init_hist_svg();
        this.init_hist_axis(scale_type);
        this.draw_hist_axis();
        this.draw_hist_bar();
        this.draw_hist_line();

        // Create and draw expected vs observed scatterplot
        this.init_scatter_svg();
        this.init_scatter_axis();
        this.draw_scatter_axis();
        this.draw_scatter_points();
    }

    // Initialise the SVG in which the plot is kept
    private init_hist_svg() {
        // Remove previous plot
        d3.select("#count_diagnostic_div").selectAll("*").remove();

        const box_width = this.plotareaParent.nativeElement.clientWidth - 40;
        let box_height = this.plotareaParent.nativeElement.clientHeight - 40;

        if (box_height < box_width) {
            box_height = box_width * 1.2;
        }
        // Create new plot
        this.hist_svg = d3.select("#count_diagnostic_div").append("svg").attr("width", box_width).attr("height", box_height);

        this.hist_width = box_width - 20; // +this.hist_svg.attr('width') - this.margin.left - this.margin.right;
        this.hist_height = box_height - 200; // +this.hist_svg.attr('height') - this.margin.top - this.margin.bottom;
        this.hist_g = this.hist_svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    // Define plot axis lengths
    private init_hist_axis(scaling: string) {
        this.hist_x = d3Scale.scaleLinear().rangeRound([0, this.hist_width]);

        switch (scaling) {
            case "log":
                this.hist_y = d3Scale.scaleLog().base(10).rangeRound([this.hist_height, 0]);
                this.log_scale = true;
                break;
            default:
                this.hist_y = d3Scale.scaleLinear().rangeRound([this.hist_height, 0]);
                this.log_scale = false;
                break;
        }

        this.hist_x.domain([0, d3_test.max(this.count_diagnostics.map((d) => d.count_x))]);
        this.hist_y.domain([1, d3_test.max(this.count_diagnostics.map((d) => d.count_y + 1))]);
    }

    // Draw axes onto the plot
    private draw_hist_axis() {
        // y-axis
        this.hist_g.append("g").attr("class", "axis axis--y").call(d3Axis.axisLeft(this.hist_y));

        // x-axis
        this.hist_g
            .append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0, " + this.hist_height + ")")
            .call(d3Axis.axisBottom(this.hist_x));

        // x-axis title
        this.hist_g
            .append("text")
            .attr("transform", "translate(" + this.hist_width / 2 + "," + (this.hist_height + this.margin.top + 20) + ")")
            .style("fill", "black")
            .text("Expected " + (this.cost_scatter ? "Total Secondary Care Appointments" : this.use_response.join("+")));

        // y-axis title
        this.hist_g
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - this.margin.left / 2 - 60)
            .attr("x", 0 - this.hist_height / 2)
            .attr("dy", "4em")
            .attr("dx", "4em")
            .style("text-anchor", "start")
            .style("fill", "black")
            .text("Number of Patients");
    }

    private draw_hist_bar() {
        const bars = this.hist_g
            .selectAll(".hist_bar")
            .data(this.count_diagnostics)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", (d) => this.hist_y(d.count_y + 1))
            .attr("x", (d) => this.hist_x(d.count_x))
            .attr("stroke", "black")
            .attr("opacity", 0.3)
            .attr("stroke-width", 0.4)
            .attr("height", (d) => {
                return Math.max(this.hist_height - this.hist_y(d.count_y + 1), 0);
            })
            .attr("width", (d) => this.hist_x(this.binwidth));
    }

    private draw_hist_line() {
        this.hist_line = this.hist_g
            .selectAll(".count_line")
            .data(this.count_diagnostics)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", (d) => this.hist_y(d.predict_y + 1))
            .attr("x", (d) => this.hist_x(d.predict_x))
            .attr("stroke", "steelblue")
            .attr("fill", "steelblue")
            .attr("opacity", 0.3)
            .attr("stroke-width", 0.4)
            .attr("height", (d) => Math.max(0, this.hist_height - this.hist_y(d.predict_y + 1)))
            .attr("width", (d) => this.hist_x(this.binwidth));
    }

    // Initialise the SVG in which the plot is kept
    private init_scatter_svg() {
        // Remove previous plot
        const svg_remove = d3_test.select("#scatterplot_div");
        svg_remove.selectAll("*").remove();

        const box_width = this.plotareaParent.nativeElement.clientWidth - 40;
        let box_height = this.plotareaParent.nativeElement.clientHeight - 40;

        if (box_height < box_width) {
            box_height = box_width * 1.2;
        }

        // Create new plot
        d3.select("#scatterplot_div").append("svg").attr("id", "scatter_plot").attr("width", box_width).attr("height", box_height);

        this.scatter_svg = d3.select("#scatter_plot");
        this.scatter_width = box_width - 20; // +this.scatter_svg.attr('width') - this.margin.left - this.margin.right;
        this.scatter_height = box_height - 200; // +this.scatter_svg.attr('height') - this.margin.top - this.margin.bottom;
        this.scatter_g = this.scatter_svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }

    // Define plot axis lengths
    private init_scatter_axis() {
        this.scatter_x = d3Scale.scaleLinear().rangeRound([0, this.hist_width]);
        this.scatter_y = d3Scale.scaleLinear().rangeRound([this.hist_height, 0]);
        this.scatter_x.domain([
            // d3_test.min(this.response.map((d) => d.expected)),
            0,
            Math.max(d3_test.max(this.response.map((d) => d.expected)), d3_test.max(this.response.map((d) => d.observed))),
        ]);
        this.scatter_y.domain([
            0,
            Math.max(d3_test.max(this.response.map((d) => d.expected)), d3_test.max(this.response.map((d) => d.observed))),
        ]);
    }

    // Draw axes onto the plot
    private draw_scatter_axis() {
        // y-axis
        this.scatter_g.append("g").attr("class", "axis axis--y").call(d3Axis.axisLeft(this.scatter_y));

        // x-axis
        this.scatter_g
            .append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0, " + this.scatter_height + ")")
            .call(d3Axis.axisBottom(this.scatter_x).ticks(10));

        // Rotate text slightly
        this.scatter_g
            .selectAll("text")
            //        .style('text-anchor', 'start')
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-35)");

        // x-axis title
        this.scatter_g
            .append("text")
            .attr("transform", "translate(" + this.scatter_width / 2 + "," + (this.scatter_height + this.hist_margin.top + 20) + ")")
            .style("fill", "black")
            .text("Expected " + (this.cost_scatter ? "Cost [x £1,000,000]" : this.use_response[0]));

        // y-axis title
        this.scatter_g
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - this.hist_margin.left / 2 - 20)
            .attr("x", 0 - this.scatter_height / 2)
            .attr("dy", "0.71em")
            .style("text-anchor", "start")
            .style("fill", "black")
            .text("Observed " + (this.cost_scatter ? "Cost [x £1,000,000]" : this.use_response[0]));
    }

    // Draw the bars onto the barplot
    private draw_scatter_points() {
        const max_x = d3Array.max(this.response.map((d) => d.expected));
        const linear_data = d3_test.range(0, max_x, max_x / 100);

        // Add y = x line for reference
        this.scatter_g
            .selectAll(".scatter_linear_line")
            .data(linear_data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 2)
            .attr("cy", (d) => {
                return this.scatter_y(d);
            })
            .attr("cx", (d) => {
                return this.scatter_x(d);
            })
            .attr("fill", "black");

        this.scatter_g
            .selectAll(".scatter_uncertainty")
            .data(this.response)
            .enter()
            .append("line")
            .attr("class", "line")
            .attr("x1", (d) => this.scatter_x(d.expected_lower))
            .attr("x2", (d) => this.scatter_x(d.expected_higher))
            .attr("y1", (d) => this.scatter_y(d.observed))
            .attr("y2", (d) => this.scatter_y(d.observed))
            .attr("fill", "none")
            .attr("stroke", (d) => (d.significant === "Yes" ? "crimson" : "darkgrey"))
            .attr("stroke-width", 2);

        // Add observed vs expected points
        this.scatter_g
            .selectAll(".scatter_point")
            .data(this.response)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cy", (d) => this.scatter_y(d.observed))
            .attr("cx", (d) => this.scatter_x(d.expected))
            .style("fill", (d) => (d.significant === "Yes" ? "crimson" : "darkgrey"));
    }

    ngOnInit() {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            this.tokenDecoded = decodeToken(token);
            this.cohortsService
                .get({
                    username: this.tokenDecoded.username,
                })
                .subscribe((res: any[]) => {
                    this.cohort_array = res;
                    this.cohort_array.forEach((d) => {
                        this.cohort_names.push("Cohort " + d.cohortName);
                    });
                    this.cohort_names.forEach((d) => {
                        this.response_variable.push(d);
                    });
                });

            /** this.cohortService.get()
          .subscribe(res => {
            this.cohort_array = res;
            this.cohort_array.forEach(d => {
              this.cohort_names.push('Cohort ' + d.cohortName);
            });
            this.cohort_names.forEach(d => {
              this.response_variable.push(d);
            });
          })*/
        }
    }
}

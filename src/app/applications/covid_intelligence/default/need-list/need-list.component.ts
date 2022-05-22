import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Axis from "d3-axis";
import * as d3_test from "d3";
import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { ToastrService } from "ngx-toastr";
import { JoyrideService } from "ngx-joyride";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { AuthState } from "../../../../_states/auth.state";
import { APIService } from "diu-component-library";
import { decodeToken } from "../../../../_pipes/functions";
import { CviCohortService } from "../../_services/cvicohort-service";
import { environment } from "src/environments/environment";
declare let window: any;

@Component({
    selector: "app-need-list",
    templateUrl: "./need-list.component.html",
    styleUrls: ["./need-list.component.scss"],
})
export class NeedListComponent implements OnInit {
    @ViewChild("div_template") plotareaParent: ElementRef;
    @ViewChild("diagnostic_div") logistic_roc_pr_Parent: ElementRef;
    @ViewChild("variable_importance_div") logistic_var_imp_Parent: ElementRef;
    @ViewChild("count_diagnostic_div") count_hist_Parent: ElementRef;
    @ViewChild("scatterplot_div") scatter_Parent: ElementRef;
    @ViewChild("expansion_panel") expansion_panel_Parent: ElementRef;
    sortMethod = "ratio";
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
        "Coronary Heart Disease",
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
        "Shielding Patients",
    ];
    response_variableCopy: string[] = [];
    // Predictor variable array
    predictors = [
        "Age",
        "Age Band",
        "Sex",
        "Deprivation Decile",
        "Asthma",
        "Coronary Heart Disease",
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
        "Shielding Patients",
    ];
    ccg_list = [];
    cohort_array: any;
    cohort_names = []; // ['Cohort Young/Female/Hypertension'];
    // Area grouping array
    area = ["GP Practice", "Primary Care Network", "CCG", "ICP"];
    training_groups = [];
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
    private practiceList: [];
    selected_ccg = this.ccg_list;
    selected_training = this.training_groups["area"];
    minData = true;
    gpNameLookup: { code: string; name: string }[] = [];

    constructor(
        public http: HttpClient,
        private toastr: ToastrService,
        private router: Router,
        private cviCohortsService: CviCohortService,
        private readonly joyrideService: JoyrideService,
        private apiService: APIService,
        private store: Store
    ) {
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
        this.toastr.show("", "Please Select " + n.toString() + " " + toast_message + " Only.");
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
            // this.plot_logistic_diagnostics();
        } else {
            this.count_diagnostics = response.diagnostics;
            // this.plot_count_diagnostics("log");
        }

        this.sort_by_method();
    };

    get_cohort_name(str) {
        return str.split("Cohort ")[1];
    }

    get_pcn() {
        const http_request = "https://need." + environment.websiteURL + "/get_ccg_pcn_list";

        // http_request = "'" +
        //   http_request +
        //   this.ccg_list.join("','") +
        //   "'";

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
                    this.practiceList = res.body;
                    this.practiceList.forEach((d: any) => {
                        d.ccg = d.ccg.split("&").join("and");
                    });
                    this.practiceList.filter((d: any) => d.pcn);
                    this.training_groups.forEach((d) => {
                        d.area = [];
                        this.practiceList.filter((e: any) => e.ccg === d.name).forEach((e: any) => d.area.push(e.pcn));
                        d.area = d.area.filter(Boolean);
                    });
                },
                () => {
                    this.server_error_toaster("Server");
                }
            );
    }

    get_ccgs() {
        const http_request = "https://need." + environment.websiteURL + "/get_ccg_list";

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
                    const ccgList = res.body;
                    ccgList.forEach((d) => this.ccg_list.push(d.ccg));
                    this.training_groups = ccgList;
                    this.training_groups.forEach((d) => {
                        d.name = d.ccg.split("&").join("and");
                    });
                },
                () => {
                    this.server_error_toaster("Server");
                }
            );
    }

    // Send API call to plumbeR
    send_api() {
        // let http_request = this.origin + "modelledneed/logistic_model_api?";
        let http_request = "https://need." + environment.websiteURL + "/modelled_needs_api?";

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
            this.use_area.forEach((d) => {
                http_request = http_request + "area_level=" + (d as string);
                if (d === "GP Practice") {
                    flag = true;
                }
            });

            // Add Response Variable(s)
            if (this.use_response.toString().includes("Cohort")) {
                const cohort = this.cohort_array.filter((x) => "Cohort " + (x.cohortName as string) === this.use_response.toString());

                if (cohort.length > 0) {
                    http_request = http_request + "&response_filter_1=" + JSON.stringify(cohort[0].cohorturl);
                }
            } else {
                this.use_response.forEach((d, i) => {
                    http_request = http_request + "&response_filter_" + (i + 1).toString() + "=" + (d as string);
                });
            }

            // Add Predictor Variable(s)
            this.use_predict.forEach((d, i) => {
                http_request = http_request + "&group_" + (i + 1).toString() + "=" + (d as string);
            });

            // Add age grouping flag
            if (this.use_predict.indexOf("Age Band") !== -1) {
                http_request = http_request + "&age_as_a_factor=Y";
            }

            // Add CCG filtering (filter training set to specified area)
            if (this.selected_ccg) {
                http_request = http_request + "&filter_to_area=" + this.selected_ccg.join("','");
            }

            // Add CCG filtering (filter training set to specified area)
            if (this.selected_training) {
                http_request = http_request + "&train_on_area=" + (this.selected_training as string);
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
                    () => {
                        this.hide();
                        this.server_error_toaster("Server");
                    }
                );
        }
    }

    // private zoom(svg) {
    //   const extent = [
    //     [this.margin.left, this.margin.top],
    //     [this.width - this.margin.right, this.height - this.margin.top]
    //   ];
    //
    //   svg.call(d3_test.zoom()
    //       .scaleExtent([1, 8])
    //       .translateExtent(extent)
    //       .extent(extent)
    //       .on("zoom", zoomed));
    // }
    //
    // private zoomed(event) {
    //   x.range([this.margin.left, this.width - this.margin.right].map((d) => event.transform.applyX(d)));
    //   svg.selectAll(".bars rect").attr("x", d => x(d.name)).attr("width", x.bandwidth());
    //   svg.selectAll(".x-axis").call(xAxis);
    // }

    // Make the barplot, sorted by whichever method is desired
    sort_by_method(sort_method: string) {
        this.sortMethod = sort_method;
        this.init_svg();
        this.init_axis();

        switch (sort_method) {
            case "ratio":
                this.response.sort((a, b) => {
                    return d3_test.ascending(a.match_ratio, b.match_ratio);
                });
                break;
            case "significance":
                this.response.sort((a, b) => {
                    return d3_test.ascending(a.significance, b.significance);
                });
                break;
            default:
                this.response.sort((a, b) => {
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

        // d3.select("#div_template").selectAll("*").remove();

        // Remove g if browser is Internet Explorer, don't if not
        if (/msie\s|trident\//i.test(window.navigator.userAgent)) {
            d3.select("g").remove();
        }

        const tooltip_remove = d3.select("mat-sidenav-content").selectAll(".tooltip");
        tooltip_remove.remove();

        const box_width = this.plotareaParent.nativeElement.clientWidth - 40;
        let box_height = this.plotareaParent.nativeElement.clientHeight - 40;
        if (box_height < box_width) {
            box_height = box_width * 1.2;
        }

        if (this.response.length > 40) {
            box_height = 20 * this.response.length + 40;
        }

        if (this.svg) {
            this.svg.selectAll("*").remove();
        }

        // Create new plot
        if (this.svg === undefined) {
            d3.select("#div_template").append("svg").attr("class", "plotarea").attr("id", "plotarea");
        }
        this.svg = d3.select(".plotarea");
        this.svg.attr("width", box_width).attr("height", box_height);
        this.width = box_width - 20;
        this.height = box_height - 20;
        this.g = this.svg.append("g").attr("transform", "translate(10," + this.margin.top.toString() + ")");
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
            .attr("transform", "translate(" + (this.width / 2).toString() + ", 0)")
            .call(d3Axis.axisLeft(this.y));

        // Swap y-axis label side for negative values
        this.g
            .selectAll(".tick")
            .data(this.response)
            .select("text")
            .attr("x", (d) => (d.match_ratio < 1 ? 9 : -9))
            .style("text-anchor", (d) => (d.match_ratio < 1 ? "start" : "end"));

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
        let html;

        switch (tooltip_type) {
            case "ROC_PR":
                html = this.htmlROCTooltip(datum);
                break;
            default:
                html = this.htmlTooltip(datum);
                break;
        }
        this.tooltip
            .html(html)
            .style("left", rect.left.toString() + x.toString() + "px")
            .style("top", (drawer.scrollTop + rect.top + y - 150).toString() + "px");
    }

    htmlTooltip(d: any) {
        // Observed - if cost then round to nearest 100,000 and add £ symbol
        //          - otherwise just round
        let observed;
        if (this.cost_scatter) {
            observed = "£ " + (Math.round(d.observed * 1000) * 1000).toString();
        } else {
            observed = Math.round(d.observed);
        }

        let expected;
        if (this.cost_scatter) {
            expected = "£ " + (Math.round(d.expected * 1000) * 1000).toString();
        } else {
            expected = Math.round(d.expected);
        }

        let output;
        output = "	<div id='modelledneedToolTip' class='container'>";

        output += "		<div class='row'>";
        output += "<h5>Area: " + (d.area_var as string) + "</h5>";
        output += "		</div>";
        output += "		<div class='row'>";
        output += "<h5>Observed: " + (observed as string) + "</h5>";
        output += "		</div>";
        output += "		<div class='row'>";
        output += "<h5>Expected: " + (expected as string) + "</h5>";
        output += "		</div>";
        output += "		<div>";
        output += "<h5>Observed - Expected Difference: </h5><h5>";
        output +=
            Math.round(100 * (d.match_ratio - 1)).toString() +
            " &plusmn; " +
            Math.round((100 * (d.match_higher - d.match_lower)) / 2).toString() +
            "%</h5>";
        output += "		</div>";

        output += "	</div>";
        return output;
    }

    htmlROCTooltip(d: any) {
        let output;

        output = "	<div id='modelledneedToolTip' class='container'>";
        output += "		<div class='row'>";
        output += "<h5> Area Under the Curve = " + (d.auc as string) + "</h5>";
        output += "		</div>";
        output += "		<div class='row'>";
        output += "<h5> False Positive Rate = " + (d.false_positive as string) + "</h5>";
        output += "		</div>";
        output += "		<div class='row'>";
        output += "<h5> True Positive Rate = " + (d.true_positive as string) + "</h5>";
        output += "		</div>";
        output += "		<div class='row'>";
        output += "<h5> Cutoff = " + (d.cutoff as string) + "</h5>";
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
            .attr("y1", (d) => (this.y(d.area_var) as number) + (this.y.bandwidth() as number) / 2)
            .attr("y2", (d) => (this.y(d.area_var) as number) + (this.y.bandwidth() as number) / 2)
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
            .attr("y1", (d) => (this.y(d.area_var) as number) + (this.y.bandwidth() as number) / 2 - 4)
            .attr("y2", (d) => (this.y(d.area_var) as number) + (this.y.bandwidth() as number) / 2 + 4)
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
            .attr("y1", (d) => (this.y(d.area_var) as number) + (this.y.bandwidth() as number) / 2 - 4)
            .attr("y2", (d) => (this.y(d.area_var) as number) + (this.y.bandwidth() as number) / 2 + 4)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    }

    ngOnInit() {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            this.tokenDecoded = decodeToken(token);
            this.cviCohortsService.get({ username: this.tokenDecoded.username }).subscribe((res: any[]) => {
                this.cohort_array = res;
                this.cohort_array.forEach((d) => {
                    this.cohort_names.push("Cohort " + (d.cohortName as string));
                });
                this.cohort_names.forEach((d) => {
                    this.response_variable.push(d);
                });
            });

            this.get_ccgs();
            this.selected_ccg = this.ccg_list;
            this.get_pcn();
        }
    }
}

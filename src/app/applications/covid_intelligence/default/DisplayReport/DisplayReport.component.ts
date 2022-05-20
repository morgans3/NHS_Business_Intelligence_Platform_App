import { Component, OnInit, Directive, Input, ElementRef, Renderer2 } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { Store } from "@ngxs/store";
import { AuthState } from "../../../../_states/auth.state";
import { decodeToken } from "../../../../_pipes/functions";

export interface ReportDetails {
    _id: string;
    name: string;
    description: string;
    publisher: string;
    publisherNotes?: string;
    analysis: boolean;
    analysisContent?: string;
    reportUrl: string;
    authentication: boolean;
    teamcode?: string;
}

@Component({
    selector: "app-DisplayReport",
    templateUrl: "./DisplayReport.component.html",
})
export class DisplayReportComponent implements OnInit {
    reportID: string;
    lastReportID: string;
    thisReport: ReportDetails;
    username: string;

    reportExamples: ReportDetails[] = [
        {
            _id: "1",
            name: "Test Qlik Sense",
            description: "This is a test",
            publisher: "Tester",
            authentication: false,
            analysis: false,
            reportUrl:
                "https://sense-demo.qlik.com/sso/sense/app/dcb7c95a-9ecd-43e2-8786-cae00108a324/" +
                "sheet/54b60312-68c5-4d92-a225-79326b68ad5a/state/analysis",
        },
        {
            _id: "2",
            name: "Test Power BI",
            description: "This is a test",
            publisher: "Tester",
            authentication: false,
            analysis: false,
            reportUrl:
                "https://app.powerbi.com/view?r=eyJrIjoiMTlhNjM4NTMtZWU2Ni00YWNlLTg5ZDItM2NiYm" +
                "RhNjA2MDZjIiwidCI6ImJhMzNiNjE1LTI3MzItNGYwYi05MmU2LWE3NDZlNWNjNzBhMCIsImMiOjN9",
        },
        {
            _id: "3",
            name: "Test Tableau",
            description: "This is a test",
            publisher: "Tester",
            authentication: false,
            analysis: false,
            reportUrl:
                "https://public.tableau.com/views/NHSRightCareSimilar10CCGInteractiveMap/" +
                "Similar10CCGInteractiveMap?:embed=y&:display_count=yes&:showVizHome=no",
        },
        {
            _id: "4",
            name: "Test Qlik View",
            description: "This is a test",
            publisher: "Tester",
            authentication: false,
            teamcode: "DIU",
            analysis: false,
            reportUrl: "https://eu-b.demo.qlik.com/QvAJAXZfc/opendoc.htm?document=qvdocs%2FEpidemiology%20-Tycho.qvw&host=demo11",
        },
        {
            _id: "5",
            name: "Test Tableau",
            description: "This is a test",
            publisher: "Tester",
            authentication: false,
            teamcode: "DIU",
            analysis: false,
            publisherNotes: "These are the notes provided by the Publisher.",
            reportUrl:
                "https://public.tableau.com/views/TopCCGsandGPPracticesbypotentialsavingsforanexampleUKmarket/" +
                "TopCCGsandGPPracticesbypotentialsavingsforanexampleUKmarketsavingsdashboard?:embed=y&:display_count=yes&:showVizHome=no",
        },
        {
            _id: "6",
            name: "Test Power BI",
            description: "This is a test",
            publisher: "Tester",
            authentication: false,
            teamcode: "DIU",
            analysis: true,
            analysisContent: "This is the analysis by our team.",
            reportUrl:
                "https://app.powerbi.com/view?r=eyJrIjoiNzNmNTIxZjQtZjNlMy00NmRkLWI4MTctN2ZiZDBjNDhkMGN" +
                "lIiwidCI6IjgxNzdmMWQzLWU2NTAtNDAxNS1iNzdhLTY4MjUxODQwMzRiNyJ9",
        },
    ];

    private getReportID() {
        const url = window.location.toString();
        const ar = url.split("/");
        const lastPartOfUrl = ar[ar.length - 1];
        this.reportID = lastPartOfUrl;
    }
    constructor(private router: Router, private sanitizer: DomSanitizer, private store: Store) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            const tokenDecoded: any = decodeToken(token);
            this.username = tokenDecoded.username;
        }
        this.getReportID();
        if (this.reportID !== this.lastReportID) {
            this.lastReportID = this.reportID;
            const report = this.reportExamples.filter((x) => x["_id"] === this.reportID)[0];
            if (report) {
                this.thisReport = report;
            }
        }
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.getReportID();
                if (this.reportID !== this.lastReportID) {
                    this.lastReportID = this.reportID;
                    const report = this.reportExamples.filter((x) => x["_id"] === this.reportID)[0];
                    if (report) {
                        this.thisReport = report;
                    }
                }
            }
        });
    }

    sanitizeURL(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}

@Directive({
    selector: "iframe",
})
export class CachedSrcDirective {
    @Input()
    public get cachedSrc(): string {
        return this.elRef.nativeElement.src;
    }
    public set cachedSrc(src: string) {
        if (this.elRef.nativeElement.src !== src) {
            this.renderer.setAttribute(this.elRef.nativeElement, "src", src);
        }
    }

    constructor(private elRef: ElementRef, private renderer: Renderer2) {}
}

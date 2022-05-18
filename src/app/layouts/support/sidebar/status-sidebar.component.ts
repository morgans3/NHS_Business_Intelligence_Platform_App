import { ChangeDetectorRef, Component, OnDestroy, Input, OnInit, OnChanges, ViewEncapsulation } from "@angular/core";

import { MediaMatcher } from "@angular/cdk/layout";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { iMenu } from "diu-component-library";

@Component({
    selector: "app-status-sidebar",
    templateUrl: "./status-sidebar.component.html",
    styleUrls: ["./status-sidebar.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class SupportLayoutSidebarComponent implements OnDestroy, OnInit, OnChanges {
    @Input() minisidebar = false;
    public config: PerfectScrollbarConfigInterface = {};
    mobileQuery: MediaQueryList;

    email = "";
    isMinisidebar = false;
    shownMenuItems: iMenu[] = [
        {
            state: "support/guides",
            name: "Support",
            type: "link",
            icon: "fas fa-headset",
        },
        {
            state: "support/access-request",
            name: "Account Request",
            type: "link",
            icon: "fas fa-user-plus",
        },
        {
            state: "login",
            name: "Back to Login",
            type: "link",
            icon: "fas fa-sign-in-alt",
        },
    ];

    private mobileQueryListener: () => void;

    constructor(media: MediaMatcher, changeDetectorRef: ChangeDetectorRef) {
        this.mobileQuery = media.matchMedia("(min-width: 768px)");
        this.mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this.mobileQueryListener);
    }

    ngOnInit() {
        this.isMinisidebar = this.minisidebar;
    }

    ngOnChanges() {
        this.isMinisidebar = this.minisidebar;
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this.mobileQueryListener);
    }

    navHome() {}

    subChildren(children: any) {
        return children.filter((x: any) => x.type === "sub");
    }

    nonsubChildren(children: any) {
        return children.filter((x: any) => x.type !== "sub");
    }
}

import { MediaMatcher } from "@angular/cdk/layout";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { environment } from "../../../environments/environment";

@Component({
    selector: "app-support-layout",
    templateUrl: "./support.component.html",
    styleUrls: ["./support.component.scss"],
})
export class SupportLayoutComponent implements OnDestroy, OnInit {
    mobileQuery: MediaQueryList;
    dir = "ltr";
    green = false;
    blue = false;
    dark = false;
    minisidebar = false;
    boxed = false;
    danger = false;
    showHide = false;
    sidebarOpened = true;
    env: any;
    pageloaded = false;
    managedWidth = true;
    appName = environment.appName;
    home = environment.homepage;
    isIE = /msie\s|trident\//i.test(window.navigator.userAgent);

    private mobileQueryListener: () => void;

    constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private titleService: Title) {
        this.minisidebar = false;
        this.mobileQuery = media.matchMedia("(min-width: 768px)");
        this.mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this.mobileQueryListener);
        this.env = environment;
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 400);
    }

    ngOnInit() {
        this.titleService.setTitle(this.appName);
        this.pageloaded = true;
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this.mobileQueryListener);
    }

    toggleSidebar() {
        this.minisidebar = !this.minisidebar;
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 400);
    }
}

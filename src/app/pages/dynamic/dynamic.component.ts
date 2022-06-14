import { Component, OnChanges, OnDestroy } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { APIService } from "diu-component-library";
import { iPageConfig } from "../../layouts/full/full.component";
import { DynamicConfigState, GetConfigByID } from "../../_states/dynamic-config.state";
import { Store } from "@ngxs/store";

declare function cwr(operation: string, payload: any): void;

@Component({
    selector: "app-dynamic",
    templateUrl: "./dynamic.component.html",
})
export class DynamicComponent implements OnChanges, OnDestroy {
    pageConfig: iPageConfig | undefined;
    routerEventsSubscription;
    location = "";

    constructor(private store: Store, private router: Router, private apiService: APIService) {
        // Track pages with AWS RUM
        this.routerEventsSubscription = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                // Record RUM view
                this.location = this.getLocation();
                if (!this.router.url.includes("localhost")) cwr("recordPageView", this.router.url);

                if (this.location === "") {
                    const urlWithoutLeadingUnderline = event.urlAfterRedirects.substr(1, event.urlAfterRedirects.length);
                    this.location = urlWithoutLeadingUnderline.replace("/", "_");
                }

                // Get page
                console.log("Get oag", this.location)
                this.getPage(this.location);
            }
        });
    }

    ngOnChanges(): void {
        const currPage = this.getLocation();
        if (this.location !== currPage) {
            this.location = currPage;
            if (this.location !== "") {
                this.getPage(this.location);
            }
        }
    }

    getLocation() {
        const appInfo = localStorage.getItem("@");
        if (appInfo) {
            const urlTree = this.router.parseUrl(this.router.url);
            const curSegment = urlTree.root.children.primary.segments[0].path;
            console.log("Obtaining page " + curSegment + " from database...");
            return curSegment;
        }
        return "";
    }

    getPayloadById(id): Promise<any> {
        return new Promise((resolve) => {
            // Get item if not stored
            this.store.dispatch(new GetConfigByID(id)).subscribe(() => {
                this.store.select(DynamicConfigState.getConfigById(id)).subscribe((payload) => {
                    resolve(payload);
                });
            });
        });
    }

    getPage(currentpage: string) {
        this.pageConfig = undefined;
        this.getPayloadById(currentpage).then((payload) => {
            if (payload) {
                const thisPage = payload;
                this.constructPage(thisPage);
            }
        });
    }

    constructPage(page: iPageConfig) {
        this.pageConfig = page;
        const configuration = JSON.parse(this.pageConfig.config);
        if (configuration.children) {
            this.pageConfig.children = [];
            configuration.children.forEach((child: any) => {
                this.getPayloadById(child.id).then((payload) => {
                    if (payload) {
                        // Set child
                        const thisChild = payload;
                        this.pageConfig.children.push(thisChild);

                        // Sort children
                        const selectedPageConfig = JSON.parse(this.pageConfig?.config);
                        const childorder = selectedPageConfig.children;
                        this.pageConfig.children.forEach((child) => {
                            child.order = parseInt(childorder.find((x: any) => x.id === child.id).order);
                        });
                        this.pageConfig.children.sort((a: any, b: any) => {
                            return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
                        });
                    }
                });
            });
        }
    }

    modify(config: any) {
        try {
            return JSON.parse(config);
        } catch {
            return config;
        }
    }

    ngOnDestroy() {
        this.routerEventsSubscription.unsubscribe();
    }
}

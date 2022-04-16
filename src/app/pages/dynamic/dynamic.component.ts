import { Component, OnChanges, SimpleChanges } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { DynamicApiService } from "diu-component-library";
import { iAppConfig, iPageConfig } from "../../layouts/full/full.component";

@Component({
  selector: "app-dynamic",
  templateUrl: "./dynamic.component.html",
})
export class DynamicComponent implements OnChanges {
  pageConfig: iPageConfig | undefined;
  appConfig: iAppConfig | undefined;
  location: string = "";

  constructor(private router: Router, private dynapiService: DynamicApiService) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.location = this.getLocation();

        if (this.location === "") {
          const urlWithoutLeadingUnderline = event.urlAfterRedirects.substr(1, event.urlAfterRedirects.length);
          this.location = urlWithoutLeadingUnderline.replace("/", "_");
        }
        this.getPage(this.location);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const currPage = this.getLocation();
    if (this.location !== currPage) {
      this.location = currPage;
      if (this.location !== "") {
        this.getPage(this.location);
      }
    }
  }

  getLocation() {
    const appInfo = localStorage.getItem("@AppConfig");
    if (appInfo) {
      this.appConfig = JSON.parse(appInfo);
      const urlTree = this.router.parseUrl(this.router.url);
      const curSegment = urlTree.root.children.primary.segments[0].path;
      console.log("Obtaining page " + curSegment + " from database...");
      return curSegment;
    }
    return "";
  }

  getPage(currentpage: string) {
    this.pageConfig = undefined;
    this.dynapiService.getPayloadById(currentpage).subscribe((data: any) => {
      if (data && data.length > 0) {
        const thisPage = data[0];
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
        this.dynapiService.getPayloadById(child.id).subscribe((data: any) => {
          if (data && data.length > 0) {
            const thisChild = data[0];
            this.pageConfig!.children.push(thisChild);
            this.sortChildren();
          }
        });
      });
    }
  }

  sortChildren() {
    const selectedPageConfig = JSON.parse(this.pageConfig?.config);
    const childorder = selectedPageConfig.children;
    this.pageConfig!.children.forEach((child) => {
      child.order = parseInt(childorder.find((x: any) => x.id === child.id).order);
    });
    this.pageConfig!.children.sort((a: any, b: any) => {
      return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
    });
  }

  modify(config: any) {
    try {
      return JSON.parse(config);
    } catch {
      return config;
    }
  }
}

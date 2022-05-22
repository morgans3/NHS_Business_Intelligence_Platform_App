import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { environment } from "src/environments/environment";

export interface iConfluenceSearchItem {
    id: string;
    extensions: any;
    status: string;
    title: string;
    type: string;
    _expandable: any;
    _links: any;
}

@Component({
    selector: "app-guide",
    templateUrl: "./guides.component.html",
    styleUrls: ["./guides.component.scss"],
})
export class GuideComponent implements OnInit {
    guides = [];
    loading = true;
    filters = { keyword: "" };

    selectedGuide = null;
    baseURL = "https://api." + environment.websiteURL + "/confluence/content/";

    constructor(private http: HttpClient, private dialog: MatDialog) {}

    ngOnInit() {
        this.searchConfluenceGuides();
    }

    searchTimeout;
    searchConfluenceGuides() {
        this.loading = true;
        clearInterval(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.http
                .get(this.baseURL + "search", {
                    params: this.filters,
                })
                .subscribe((guides: any) => {
                    this.loading = false;
                    this.guides = guides.results.sort((a: iConfluenceSearchItem, b: iConfluenceSearchItem) => {
                        return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
                    });
                });
        }, 500);
    }

    getConfluenceGuide(id: string) {
        this.http.get(this.baseURL + id).subscribe((guide: any) => {
            this.selectedGuide = guide;
        });
    }

    confluenceContentClick($event) {
        if ($event.target && $event.target.tagName === "IMG") {
            import("./image-modal/image.modal").then((c) => {
                const dialog = this.dialog.open(c.ImageModalComponent);
                dialog.componentInstance.imageUrl = $event.target.src;
            });
        }
    }
}

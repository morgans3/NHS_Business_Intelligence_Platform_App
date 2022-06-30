import { Component, OnInit, ViewChild } from "@angular/core";
import { APIService } from "diu-component-library";
import { MatDialog } from "@angular/material/dialog";
import { MatTable } from "@angular/material/table";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "app-newsfeeds-table",
    templateUrl: "./newsfeeds-table.component.html",
})
export class NewsfeedsTableComponent implements OnInit {
    newsfeeds = { all: [], filtered: [] };
    @ViewChild(MatTable) table: MatTable<any>;

    constructor(private dialog: MatDialog, private notificationService: NotificationService, private apiService: APIService) {}

    ngOnInit() {
        this.apiService.getNewsFeeds().subscribe((orgs: any) => {
            this.newsfeeds = { all: orgs, filtered: orgs };
        });
    }

    search(name) {
        if (name === "") {
            this.newsfeeds.filtered = this.newsfeeds.all;
        } else {
            this.newsfeeds.filtered = this.newsfeeds.all.filter((newsfeeds) => {
                return newsfeeds.name.toLowerCase().includes(name.toLowerCase());
            });
        }
    }

    addEdit(newsfeeds = null) {
        import("../newsfeeds/newsfeeds.modal").then((c) => {
            const dialog = this.dialog.open(c.NewsfeedsModalComponent, {
                data: { newsfeeds },
            });
            dialog.afterClosed().subscribe((data) => {
                if (data) {
                    if (newsfeeds !== null) {
                        // Change item at index
                        this.newsfeeds.all[this.newsfeeds.all.findIndex((listedDash) => listedDash.destination === newsfeeds.destination)] =
                            data;

                        // Change item in filtered list
                        const filteredListIndex = this.newsfeeds.filtered.findIndex(
                            (listedDash) => listedDash.destination === newsfeeds.destination
                        );
                        if (filteredListIndex >= 0) {
                            this.newsfeeds.filtered[filteredListIndex] = data;
                        }
                    } else {
                        // Add to list
                        this.newsfeeds = { all: [data].concat(this.newsfeeds.all), filtered: [data].concat(this.newsfeeds.filtered) };
                    }

                    // Trigger material table
                    this.table.renderRows();
                }
            });
        });
    }

    delete(newsfeeds) {
        this.notificationService.question("Are you sure you want to delete this newsfeed?").then((confirmed) => {
            if (confirmed === true) {
                this.apiService.archiveNewsFeed(newsfeeds).subscribe(() => {
                    // Notify success
                    this.notificationService.success("Newsfeed has been removed successfully!");
                    // Change item at index
                    this.newsfeeds.all.splice(
                        this.newsfeeds.all.findIndex((listedDash) => listedDash.destination === newsfeeds.destination),
                        1
                    );
                    // Change item in filtered list
                    const filteredListIndex = this.newsfeeds.filtered.findIndex(
                        (listedDash) => listedDash.destination === newsfeeds.destination
                    );
                    if (filteredListIndex >= 0) {
                        this.newsfeeds.filtered.splice(filteredListIndex, 1);
                    }
                    // Trigger material table
                    this.table.renderRows();
                });
            }
        });
    }

    trunc(word, n) {
        return word.length > n ? word.substr(0, n - 1) + "..." : word;
    }
}

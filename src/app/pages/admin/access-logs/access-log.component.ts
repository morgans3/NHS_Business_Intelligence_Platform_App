import { Component } from "@angular/core";

@Component({
    selector: "app-logs-layout",
    template: `
        <div fxLayout="row wrap">
            <div fxFlex="75">
                <mat-card-title class="m-b-15">Access Logs</mat-card-title>
            </div>
            <div fxFlex="25" class="text-right">
                <button (click)="view = view === 'table' ? 'chart' : 'table'" mat-raised-button color="accent">
                    <mat-icon>{{ view === "table" ? "show_chart" : "view_headline" }}</mat-icon>
                </button>
            </div>
        </div>
        <access-logs-table *ngIf="view === 'table'"></access-logs-table>
        <access-logs-chart *ngIf="view === 'chart'"></access-logs-chart>
    `,
})
export class AccessLogComponent {
    view = "table";

    constructor() {}
}

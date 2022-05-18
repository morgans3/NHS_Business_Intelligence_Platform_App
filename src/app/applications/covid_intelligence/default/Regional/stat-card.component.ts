import { Component, Input } from "@angular/core";

export class StatCardData {
    title: string;
    value: string;
    color: string;
    icon: string;
    text?: string;
    subvalue?: string;
    subvaluetext?: string;
}

@Component({
    selector: "app-statcard",
    template: `
        <mat-card *ngIf="data" [ngClass]="data.color" style="margin-top:0px; margin-bottom: 0px">
            <mat-card-content>
                <div class="d-flex no-block align-items-center">
                    <div class="mr-auto text-white icon-2x">
                        <mat-icon *ngIf="!data.icon.includes('fas fa')" [inline]="true">{{ data.icon }}</mat-icon>
                        <i *ngIf="data.icon.includes('fas fa')" [class]="data.icon" style="margin-right: 8px"></i>
                    </div>
                    <div class="stats" style="text-align: right">
                        <h5 class="text-white m-0">{{ data.title }}</h5>
                        <h3 class="text-white m-0">
                            &nbsp;
                            <span [id]="data.value">
                                <span *ngIf="data.text">{{ data.text }}</span>
                            </span>
                            <div *ngIf="data.subvalue">
                                <span [id]="data.subvalue" style="font-size: 0.9em">
                                    <span *ngIf="data.subvaluetext">{{ data.subvaluetext }}</span>
                                </span>
                            </div>
                        </h3>
                    </div>
                </div>
            </mat-card-content>
        </mat-card>
    `,
    styles: [],
})
export class StatCardComponent {
    @Input() data: StatCardData;

    constructor() {}
}

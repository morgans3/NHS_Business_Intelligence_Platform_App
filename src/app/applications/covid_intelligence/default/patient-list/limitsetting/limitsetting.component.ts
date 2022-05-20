import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NumberDialogComponent } from "./dialognumber";

@Component({
    selector: "app-limitsetting",
    templateUrl: "./limitsetting.component.html",
})
export class LimitsettingComponent implements OnInit {
    @Input() limit: string;
    @Output() changelimit = new EventEmitter();

    constructor(public dialog: MatDialog) {}

    ngOnInit() {}

    showPopup() {
        const dialogRef = this.dialog.open(NumberDialogComponent, {
            width: "350px",
            data: this.limit,
        });
        dialogRef.afterClosed().subscribe((response) => {
            if (response) {
                this.limitchange(response.toString());
            }
        });
    }

    limitchange(newlimit) {
        this.changelimit.emit(newlimit);
    }
}

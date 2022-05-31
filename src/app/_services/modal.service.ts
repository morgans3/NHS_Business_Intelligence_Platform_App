import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Injectable()
export class ModalService {

    constructor(private dialog: MatDialog) {}

    requestHelp(request) {
        return new Promise((resolve) => {
            import("../shared/modals/request-help/request-help.modal").then((c) => {
                // Open modal with data
                resolve(
                    this.dialog.open(c.RequestHelpModalComponent, {
                        data: request,
                    })
                )
            });
        });
    }

    expandText({ text = "" }) {
        return new Promise((resolve) => {
            import("../shared/modals/expand-text/dialogexpand").then((c) => {
                // Open modal with data
                resolve(
                    this.dialog.open(c.ExpandTextDialogModalComponent, {
                        data: text,
                    })
                )
            });
        });
    }

}
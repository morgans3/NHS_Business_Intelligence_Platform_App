import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";

@Injectable()
export class ModalService {
    private toastr: any;

    constructor(private dialog: MatDialog, toastrService: ToastrService) {
        // Set defaults
        this.toastr = toastrService as any;
        this.toastr.options = {
            positionClass: "toast-bottom-right",
        };
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
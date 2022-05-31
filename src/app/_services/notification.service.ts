import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarRef } from "@angular/material/snack-bar";

@Injectable()
export class NotificationService {
    constructor(
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
    ) { }

    question(message, buttons = null): Promise<any> {
        return new Promise((resolve) => {
            import("../shared/modals/question-modal/question.modal").then((c) => {
                // Open modal with data
                const questionModal = this.dialog.open(c.QuestionModalComponent, {
                    data: { message, buttons },
                });

                // Listen for close
                questionModal.afterClosed().subscribe((value) => {
                    resolve(value || false);
                });
            });
        });
    }

    notify({ message = "", actions = null, status = "success" }): Promise<MatSnackBarRef<any>> {
        return new Promise((resolve) => {
            import("../shared/notification-snackbar/notification-snackbar").then((c => {
                // Open snackbar
                const snackBar = this.snackBar.openFromComponent(
                    c.NotificationSnackbarComponent,
                    {
                        duration: 5000,
                        horizontalPosition: "start",
                        panelClass: ["notification", status]
                    }
                );

                // Configure settings
                snackBar.instance.message = message;
                snackBar.instance.status = status;
                if(actions) { snackBar.instance.actions = actions; }

                // Return instance
                resolve(snackBar);
            }));
        });
    }

    success(message): Promise<MatSnackBarRef<any>> {
        return this.notify({
            message: (message || "Success!"),
            status: "success"
        });
    }

    error(message?: string): Promise<MatSnackBarRef<any>> {
        return this.notify({
            message: (message || "Error!"),
            status: "error"
        });
    }

    info(message?: string): Promise<MatSnackBarRef<any>> {
        return this.notify({
            message: (message || "Info"),
            status: "info"
        });
    }

    warning(message: string): Promise<MatSnackBarRef<any>> {
        return this.notify({
            message,
            status: "warning"
        });
    }
}

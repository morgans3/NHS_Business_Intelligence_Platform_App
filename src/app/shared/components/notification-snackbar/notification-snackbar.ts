import { Component, Output, EventEmitter, ViewEncapsulation } from "@angular/core";
import { MatSnackBarRef } from "@angular/material/snack-bar";

@Component({
    selector: "app-notification-snackbar",
    templateUrl: "./notification-snackbar.html",
    styles: [`
        .message {
            color: white;
            font-size: 0.95rem;
        }
        .message button {
            height: 30px;
            color: white;
            border-color: white !important;
            line-height: 30px;
        }
        .notification.success {
            background-color: #51A351;
        }
        .notification.error {
            background-color: #BD362F;
        }
        .notification.info {
            background-color: #2F96B4;
        }
        .notification.warning {
            background-color: #F89406;
        }
    `],
    encapsulation: ViewEncapsulation.None
})
export class NotificationSnackbarComponent {

    @Input() status;
    @Input() message;
    @Input() actions = [{
        id: "close",
        name: "Okay",
    }];

    @Output() dismissed = new EventEmitter();

    constructor(
        public snackbarRef: MatSnackBarRef<NotificationSnackbarComponent>
    ) { }

    dismissWithAction(id) {
        this.dismissed.emit(id);
        this.snackbarRef.dismiss();
    }
}

import { Input, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.module";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [NotificationSnackbarComponent],
})
export class NotificationSnackbarModule {}

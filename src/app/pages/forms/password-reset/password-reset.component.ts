import { Component, OnInit } from "@angular/core";
import { PasswordResetService } from "./password-reset.service";

@Component({
    selector: "app-password-reset-layout",
    templateUrl: "./password-reset.component.html",
})
export class PasswordResetLayoutComponent implements OnInit {

    step = '';

    constructor(
        private passwordResetService: PasswordResetService
    ) { }

    ngOnInit() {
        //Listen for step number
        this.passwordResetService.step.subscribe((step) => {
            this.step = step;
        });
    }
}

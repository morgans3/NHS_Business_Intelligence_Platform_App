import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "app-covid-admin",
    templateUrl: "./Admin.component.html",
})
export class AdminComponent implements OnInit {
    myForm = new FormGroup({
        pathlab: new FormControl(null, Validators.required),
        nhsnumber: new FormControl(null, Validators.required),
        email: new FormControl(null),
        mobilenumber: new FormControl(null),
    });
    @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
    form: any;
    constructor(private notificationService: NotificationService) {}

    ngOnInit() {}

    onSubmit() {
        this.notificationService.error("Service no longer available");
    }

    clearForm() {
        this.formDirective.resetForm();
    }
}

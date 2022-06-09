import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, ValidationErrors } from "@angular/forms";
import { NotificationService } from "../../../_services/notification.service";
import { APIService } from "diu-component-library";

const isValidPartnerEmail = (email) => {
    return email.match(/@nhs.net|@nhs.uk|@gov.uk|@ac.uk|.org|@derianhouse.co.uk/);
};

@Component({
    selector: "app-access-request",
    templateUrl: "./access-request.component.html",
    styleUrls: ["./access-request.component.scss"],
})
export class AccessRequestFormComponent implements OnInit {
    formComplete = false;
    form: FormGroup = new FormGroup(
        {
            firstname: new FormControl("", Validators.required),
            surname: new FormControl("", Validators.required),
            professional_role: new FormControl("", Validators.required),
            professional_number: new FormControl("", Validators.required),
            organisation: new FormControl("", Validators.required),
            email: new FormControl("", [
                Validators.required,
                (formControl: FormControl): ValidationErrors => {
                    // Check email
                    if (!isValidPartnerEmail(formControl.value)) {
                        return { is_personal: true };
                    } else {
                        return null;
                    }
                },
            ]),
            email_verification_code: new FormControl("", Validators.required),
            pid_access: new FormGroup({
                patient_gps: new FormControl(""),
                patient_chs: new FormControl(""),
                citizen_council: new FormControl(""),
                related_ch: new FormControl(""),
                related_mdt: new FormControl([]),
            }),
            capabilities: new FormControl([], [Validators.required]),
            terms_agreed: new FormControl(false, Validators.requiredTrue),
            date: new FormControl(new Date().toISOString()),
        }
    );

    constructor(private notificationService: NotificationService, public apiService: APIService) {}

    ngOnInit() { }

    stepChanged($event) {
        // Email verification
        if ($event.selectedIndex === 3) {
            const emailField = this.form.get("email");
            if (emailField.value !== "" && emailField.valid && !this.form.get("email_verification_code").valid) {
                this.apiService.sendVerificationCode(emailField.value).toPromise();
            }
        }
    }

    checkEmailVerificationCode(formStepper) {
        const emailField = this.form.get("email");
        const emailVerificationCodeField = this.form.get("email_verification_code");

        // Check code
        this.apiService.checkVerificationCode(emailField.value, emailVerificationCodeField.value).subscribe(
            (res: any) => {
                if (res && res.success === false) {
                    // Show error
                    emailVerificationCodeField.setErrors({ not_valid: true });
                } else {
                    // Set code value
                    emailVerificationCodeField.setErrors(null);
                    formStepper.next();
                }
            },
            (error) => {
                this.notificationService.error(error);
            }
        );
    }

    submit() {
        if (this.form.valid) {
            // Submit form
            this.apiService.sendAccessRequest(this.form.value).subscribe(() => {
                this.formComplete = true;
            });
        } else {
            this.notificationService.error("Please make sure all required fields are filled in correctly!");
        }
    }
}

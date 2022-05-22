import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class PasswordResetService {
    stepSource = new BehaviorSubject("request");
    step = this.stepSource.asObservable();

    userSource = new BehaviorSubject({
        username: null,
        organisation: null,
        code: null,
    });
    user = this.userSource.asObservable();

    nextStep() {
        const steps = ["request", "verify", "update", "complete"];
        this.stepSource.next(steps[steps.indexOf(this.stepSource.value) + 1]);
    }
}

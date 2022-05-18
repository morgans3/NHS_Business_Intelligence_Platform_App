import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { EntityGroupedResponse } from "../_models/DTOFormAnswer";

@Injectable({
    providedIn: "root",
})
export class ContextService {
    public PatientMode = new BehaviorSubject(null);
    public Patient = new BehaviorSubject(null);
    public PatientVisit = new BehaviorSubject(null);
    public Form = new BehaviorSubject(null);
    public SavedForm = new BehaviorSubject(null);

    updateMode(newmode: string) {
        this.PatientMode.next(newmode);
    }

    updateForm(formID: number) {
        this.Form.next(formID);
    }

    updateSavedForm(GroupedResponse: EntityGroupedResponse) {
        this.SavedForm.next(GroupedResponse);
    }

    clearSavedForm() {
        this.SavedForm = new BehaviorSubject(null);
    }
}

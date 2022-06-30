import { Component, Inject } from "@angular/core";
import { Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "app-capability-value-modal",
    templateUrl: "./value.modal.html",
})
export class CapabilityValueModalComponent {
    capability; children = {};
    form = new FormGroup({
        id: new FormControl(""),
        valuejson: new FormControl("", Validators.required),
        meta: new FormGroup({
            children_types: new FormControl([])
        }),
    });

    constructor(
        private apiService: APIService,
        @Inject(MAT_DIALOG_DATA) public data,
        private notificationService: NotificationService,
        public dialogRef: MatDialogRef<CapabilityValueModalComponent>
    ) { this.init(); }

    async init() {
        // Assign capability
        this.capability = this.data.capability || {};

        // Set children?
        if (this.capability.value.type_meta?.children_select) {
            // Get capabilities
            const children = await this.apiService.getCapabilities().toPromise() as any;
            this.children = children
                .filter((item) => this.capability.value.type_meta.children_select.items.enum.includes(item.id))
                .reduce((acc, item) => {
                    acc[item.id] = item;
                    return acc;
                }, {});

            // Add field
            (this.form.get("meta") as FormGroup).addControl(
                "children",
                new FormArray([], Validators.maxLength(this.capability.value.type_meta?.children_select?.max || 1))
            );
        }

        // Value provided?
        if(this.data.values) {
            // Set values
            this.form.patchValue(this.data.values);

            // Set children
            const selectedChildren = [];
            this.data.values.meta?.children.forEach(child => {
                (this.form.get("meta.children") as FormArray).push(
                    new FormGroup({
                        id: new FormControl(child.id),
                        valuejson: new FormControl(child.valuejson),
                    })
                );
                selectedChildren.push(child.id);
            });
            this.form.get("meta.children_types").setValue(selectedChildren);
        } else {
            this.form.patchValue({
                id: this.capability.id,
                valuejson: this.capability.value.type === "allow_deny" ? "allow" : "",
            });
        }
    }

    selectChild($event) {
        if ($event.option.selected === true) {
            // Add control
            (this.form.get("meta.children") as FormArray).push(
                new FormGroup({
                    id: new FormControl($event.option.value),
                    valuejson: new FormControl(""),
                })
            );
        } else {
            const currentIds = (this.form.get("meta.children") as FormArray).value.map((item) => item.id);
            const index = currentIds.findIndex((id) => id === $event.option.value);
            (this.form.get("meta.children") as FormArray).removeAt(index);
        }
    }

    hasChildren() {
        return Object.keys(this.children).length > 0;
    }

    close(data = null) {
        if (data !== null && !this.form.valid) {
            this.notificationService.error("Please complete all fields correctly");
        } else {
            delete data?.meta?.children_types;
            this.dialogRef.close(data);
        }
    }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared.module";
import { FormGroup } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { ValueFieldComponent } from "../value-field/value-field.component";
import { APIService } from "diu-component-library";
import { FormArray } from "@angular/forms";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [ValueFieldComponent, CapabilityValueModalComponent],
})
export class CapabilityValueModalModule {}

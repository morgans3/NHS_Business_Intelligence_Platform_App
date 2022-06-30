import { Component, Input, ViewChild } from "@angular/core";
import { ControlValueAccessor, FormControl, FormControlDirective, NG_VALUE_ACCESSOR, ControlContainer } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { APIService } from "diu-component-library";

@Component({
    selector: "gp-select",
    templateUrl: "./gp-select.component.html",
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: GPSelectComponent, multi: true }],
    styles: [
        `
            :host {
                display: block;
            }
            .search {
                padding: 16px 16px 0px 16px;
                border-bottom: 1px solid #949494;
            }
        `,
    ],
})
export class GPSelectComponent implements ControlValueAccessor {
    gps = { all: [], filtered: [] };

    onChange: any = () => {};
    onTouched: any = () => {};

    @Input() max = 100;
    @Input() formControl: FormControl;
    @Input() formControlName: string;
    @Input() placeholder = "Select a GP";
    @ViewChild(FormControlDirective, { static: true }) formControlDirective: FormControlDirective;

    get control() {
        return this.formControl || this.controlContainer.control.get(this.formControlName);
    }

    constructor(private controlContainer: ControlContainer, private apiService: APIService, private http: HttpClient) {}

    // Future feature: Add validation for max items

    async getGps() {
        if (this.gps.all.length === 0) {
            this.gps.all = ((await this.http.get(this.apiService.baseUrl + "gppractices/").toPromise()) as Array<any>)[0].features
                .map((gp) => gp.properties)
                .sort((a, b) => {
                    return a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0;
                });
            this.gps.filtered = this.gps.all;
        }
    }

    filterGps(name = "") {
        // Filter gps
        this.gps.filtered = this.gps.all.filter((gp) => gp.Name.toLowerCase().includes(name.toLowerCase()));
    }

    registerOnTouched(fn: any): void {
        this.formControlDirective.valueAccessor.registerOnTouched(fn);
    }

    registerOnChange(fn: any): void {
        this.formControlDirective.valueAccessor.registerOnChange(fn);
    }

    writeValue(obj: any): void {
        this.formControlDirective.valueAccessor.writeValue(obj);
    }

    setDisabledState(isDisabled: boolean): void {
        this.formControlDirective.valueAccessor.setDisabledState(isDisabled);
    }
}

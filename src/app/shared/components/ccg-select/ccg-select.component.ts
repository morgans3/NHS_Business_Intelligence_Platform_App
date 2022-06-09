import { Component, Input, ViewChild } from "@angular/core";
import { ControlValueAccessor, FormControl, FormControlDirective, NG_VALUE_ACCESSOR, ControlContainer } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

const CCGs = [
    { code: "02M", name: "Fylde & Wyre CCG" },
    { code: "00R", name: "Blackpool CCG" },
    { code: "02G", name: "W.Lancs CCG" },
    { code: "00Q", name: "Blackburn with Darwen CCG" },
    { code: "00X", name: "Chorley and South Ribble CCG" },
    { code: "01A", name: "East Lancs CCG" },
    { code: "01E", name: "Greater Preston CCG" },
    { code: "01K", name: "Lancashire North CCG" },
];

@Component({
    selector: "ccg-select",
    templateUrl: "./ccg-select.component.html",
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CCGSelectComponent, multi: true }],
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
export class CCGSelectComponent implements ControlValueAccessor {
    ccgs = { all: CCGs, filtered: CCGs };

    onChange: any = () => {};
    onTouched: any = () => {};

    @Input() max = 100;
    @Input() formControl: FormControl;
    @Input() formControlName: string;
    @Input() placeholder = "Select a CCG";
    @ViewChild(FormControlDirective, { static: true }) formControlDirective: FormControlDirective;

    get control() {
        return this.formControl || this.controlContainer.control.get(this.formControlName);
    }

    constructor(private controlContainer: ControlContainer) { }

    // To-do: Add validation for max items

    filterCCGs(name = "") {
        // Filter gps
        this.ccgs.filtered = this.ccgs.all.filter((ccg) => ccg.name.toLowerCase().includes(name.toLowerCase()));
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

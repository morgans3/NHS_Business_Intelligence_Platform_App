import { AfterViewInit, Component, Input, forwardRef, ViewChild } from "@angular/core";
import {
    ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer,
    FormControl, FormControlDirective, ValidationErrors
} from "@angular/forms";
import { isNhsNumber } from "src/app/_pipes/functions";

@Component({
    selector: "value-field",
    templateUrl: "./value-field.component.html",
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ValueFieldComponent),
        multi: true
    }],
})
export class ValueFieldComponent implements ControlValueAccessor, AfterViewInit {

    @Input() capability;
    @Input() formControl: FormControl;
    @Input() formControlName: string;
    @ViewChild(FormControlDirective, { static: false }) formControlDirective: FormControlDirective;

    get control() {
        return this.formControl || this.controlContainer.control.get(this.formControlName);
    }

    onChange: any = () => {};
    onTouched: any = () => {};

    constructor(
        private controlContainer: ControlContainer
    ) { }

    ngAfterViewInit() {
        // Change value
        this.control.valueChanges.subscribe((value) => {
            if(this.capability.value.type === "nhsnumber") {
                // Remove spaces from number
                this.control.setValue(value.replace(/\s/g, ""), { emitEvent: false });
            }
        });

        // Add validators
        this.control.addValidators((formControl: FormControl): ValidationErrors => {
            if(this.capability) {
                // Valid NHS number?
                if(this.capability.value.type === "nhsnumber") {
                    if (!isNhsNumber(formControl.value)) {
                        return { invalid_nhsnumber: true };
                    }
                }

                // Valid selection
                if(["ccglist", "gplist"].includes(this.capability.value.type)) {
                    if(formControl.value !== "" && formControl.value.length === 0) {
                        return { invalid_min: true };
                    }
                }
            }
            return null;
        })
    }

    registerOnTouched(fn: any): void {
        this.formControlDirective?.valueAccessor?.registerOnTouched(fn);
    }

    registerOnChange(fn: any): void {
        this.formControlDirective?.valueAccessor?.registerOnChange(fn);
    }

    writeValue(obj: any): void {
        this.formControlDirective?.valueAccessor?.writeValue(obj);
    }

    setDisabledState(isDisabled: boolean): void {
        this.formControlDirective?.valueAccessor?.setDisabledState(isDisabled);
    }
}
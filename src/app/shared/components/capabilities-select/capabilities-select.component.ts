import { AfterViewInit, Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { APIService } from "diu-component-library";

@Component({
    selector: "capabilities-select",
    templateUrl: "./capabilities-select.component.html",
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CapabilitiesSelectComponent),
        multi: true
    }]
})
export class CapabilitiesSelectComponent implements ControlValueAccessor, AfterViewInit {

    filters = { tag: "App", name: "" };
    selected = { ids: [], value: [] };
    capabilities = { all: [], filtered: [] };

    @Input() placeholder = "Select a GP";
    onChange: any = () => {};
    onTouched: any = () => {};

    constructor(
        private dialog: MatDialog,
        private apiService: APIService,
    ) {}

    ngAfterViewInit() {
        this.getCapabilities();
    }

    getCapabilities() {
        // Load capabilities
        if (this.capabilities.all.length === 0) {
            this.apiService.getCapabilities().subscribe((capabilties: any) => {
                // Get children
                const children = capabilties.reduce((acc, cur, i) => {
                    if(acc[cur.parent]) {
                        acc[cur.parent].push(cur);
                    } else {
                        acc[cur.parent] = [cur];
                    }
                    return acc;
                }, {});

                // Get capabilities nested
                this.capabilities.all = capabilties.reduce((capabilities, capability) => {
                    if(capability.parent == null) {
                        if(children[capability.id]) {
                            capability.children = children[capability.id];
                        }
                        capabilities.push(capability);
                    }
                    return capabilities;
                }, []);

                this.filterCapabilities({});
            });
        }
    }

    filterCapabilities({ name = this.filters.name, tag = this.filters.tag }) {
        // Filter gps
        this.filters = { name, tag };
        this.capabilities.filtered = this.capabilities.all.filter((capability) => {
            return capability.name.toLowerCase().includes(this.filters.name.toLowerCase()) && (
                (this.filters.tag === "") ? true : capability.tags.includes(this.filters.tag)
            );
        });
    }

    select($event) {
        const capability = this.capabilities.all.find((item) => item.id === $event.value);
        new Promise((resolve) => {
            if(this.selected.ids.includes(capability.id)) {
                // De-select
                this.selected.value.splice(this.selected.value.findIndex((item) => item.id === capability.id), 1);
                resolve(true);
            } else {
                // Select
                if(capability.value.type === "allow_deny" && !capability.children) {
                    this.selected.value.push({ id: capability.id, valuejson: "allow" });
                    resolve(true);
                } else {
                    // Handle alternative type
                    import("./value-modal/value.modal").then((c) => {
                        // Open modal with data
                        this.dialog.open(c.CapabilityValueModalComponent, {
                            data: { capability }, width: "60%",
                        }).afterClosed().subscribe((data) => {
                            if (data) {
                                this.selected.value.push({
                                    id: capability.id,
                                    valuejson: data.valuejson,
                                    meta: data.meta
                                });
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        });
                    });
                }
            }
        }).then(() => {
            // Set form control
            this.selected.ids = this.selected.value.map(item => item.id);
            this.onChange(this.selected.value);
        });
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    writeValue(obj: any): void {
        if(obj) {
            this.selected = { ids: obj.map(item => item.id), value: obj };
        }
    }
}
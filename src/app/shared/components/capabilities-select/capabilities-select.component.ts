import { AfterViewInit, Component, Input, forwardRef, EventEmitter, Output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { APIService } from "diu-component-library";

@Component({
    selector: "capabilities-select",
    templateUrl: "./capabilities-select.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CapabilitiesSelectComponent),
            multi: true,
        },
    ],
    styleUrls: ["./capabilities-select.component.scss"]
})
export class CapabilitiesSelectComponent implements ControlValueAccessor, AfterViewInit {
    filters = { tag: "", name: "" };
    tags = { "": "All", App: "Apps", Dashboard: "Dashboards" }

    selected = { ids: [], value: [] };
    capabilities = { all: [], filtered: [] };

    onChange: any = () => {};
    onTouched: any = () => {};
    @Input() placeholder = "Select a GP";
    @Output() initialised = new EventEmitter<CapabilitiesSelectComponent>();

    constructor(private dialog: MatDialog, private apiService: APIService) {}

    ngAfterViewInit() {
        this.getCapabilities();
    }

    getCapabilities() {
        if (this.capabilities.all.length === 0) {
            // Load capabilities
            this.apiService.getCapabilities().subscribe((capabilities: any) => {
                // Get children
                const children = capabilities.reduce((acc, cur) => {
                    if (acc[cur.parent]) {
                        acc[cur.parent].push(cur);
                    } else {
                        acc[cur.parent] = [cur];
                    }
                    return acc;
                }, {});

                // Get capabilities nested
                this.capabilities.all = capabilities.reduce((capabilities, capability) => {
                    if (capability.parent == null) {
                        if (children[capability.id]) {
                            capability.children = children[capability.id];
                        }
                        capabilities.push(capability);
                    }
                    return capabilities;
                }, []);

                // Output initialised
                this.initialised.emit(this);
                this.filterCapabilities({});
            });
        }
    }

    filterCapabilities({ name = this.filters.name, tag = this.filters.tag }) {
        // Filter gps
        this.filters = { name, tag };
        this.capabilities.filtered = this.capabilities.all.filter((capability) => {
            return (
                capability.name.toLowerCase().includes(this.filters.name.toLowerCase()) &&
                (this.filters.tag === "" ? true : capability.tags.includes(this.filters.tag))
            );
        });
    }

    async select(capability_id) {
        const capability = this.capabilities.all.find((item) => item.id === capability_id);
        if (this.selected.ids.includes(capability.id)) {
            // De-select
            this.selected.value.splice(
                this.selected.value.findIndex((item) => item.id === capability.id),
                1
            );
        } else {
            // Select
            if (capability.value.type === "allow_deny" && !capability.children) {
                this.selected.value.push({ id: capability.id, valuejson: "allow" });
            } else {
                // Load modal component
                const c = await import("./value-modal/value.modal");

                // Open modal with data
                const modal = this.dialog.open(c.CapabilityValueModalComponent, {
                    data: { capability },
                    width: "60%",
                });

                // Listen for data
                const modalResult = await modal.afterClosed().toPromise();
                if (modalResult) {
                    this.selected.value.push({
                        id: capability.id,
                        valuejson: modalResult.valuejson,
                        meta: modalResult.meta,
                    });
                }
            }
        }

        // Set form control
        this.selected.ids = this.selected.value.map((item) => item.id);
        this.onChange(this.selected.value);
    }

    async edit($event, capability_id) {
        $event?.stopPropagation();

        // Get selected
        const capability = this.capabilities.all.find((item) => item.id === capability_id);
        const selectedIndex = this.selected.value.findIndex((item) => item.id === capability.id);

        // Show value modal
        const c = await import("./value-modal/value.modal");

        // Open modal with data
        const modal = this.dialog.open(c.CapabilityValueModalComponent, {
            data: {
                capability,
                values: this.selected.value.find((item) => item.id === capability.id)
            },
            width: "60%",
        });

        // Listen for data
        const modalResult = await modal.afterClosed().toPromise();
        if (modalResult) {
            // Change value
            this.selected.value[selectedIndex] = {
                id: capability.id,
                valuejson: modalResult.valuejson,
                meta: modalResult.meta,
            };

            // Update form control
            this.onChange(this.selected.value);
        }
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    writeValue(obj: any): void {
        if (obj) {
            this.selected = { ids: obj.map((item) => item.id), value: obj };
        }
    }
}

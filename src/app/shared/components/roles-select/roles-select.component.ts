import { AfterViewInit, Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { APIService } from "diu-component-library";

@Component({
    selector: "roles-select",
    templateUrl: "./roles-select.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RolesSelectComponent),
            multi: true,
        },
    ],
})
export class RolesSelectComponent implements ControlValueAccessor, AfterViewInit {
    filters = { name: "" };
    selected = { ids: [], value: [] };
    roles = { all: [], filtered: [] };

    @Input() placeholder = "Select a role";
    onChange: any = () => {};
    onTouched: any = () => {};

    constructor(private dialog: MatDialog, private apiService: APIService) {}

    ngAfterViewInit() {
        this.getRoles();
    }

    getRoles() {
        // Load roles
        if (this.roles.all.length === 0) {
            this.apiService.getRoles().subscribe((roles: any) => {
                // Get capabilities nested
                this.roles.all = roles;
                this.filterRoles({});
            });
        }
    }

    filterRoles({ name = this.filters.name }) {
        // Filter gps
        this.filters = { name };
        this.roles.filtered = this.roles.all.filter((role) => {
            return (
                role.name.toLowerCase().includes(this.filters.name.toLowerCase())
            );
        });
    }

    select(role_id) {
        const role = this.roles.all.find((item) => item.id === role_id);
        if (this.selected.ids.includes(role.id)) {
            // De-select
            this.selected.value.splice(
                this.selected.value.findIndex((item) => item.id === role.id), 1
            );
        } else {
            // Select
            this.selected.value.push({ id: role.id });
        }

        // Set form control
        this.selected.ids = this.selected.value.map((item) => item.id);
        this.onChange(this.selected.value);
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

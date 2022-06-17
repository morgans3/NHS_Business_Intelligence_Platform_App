import { Component, Input, OnChanges, ViewChild } from "@angular/core";
import { APIService } from "diu-component-library";
import { MatTable } from "@angular/material/table";
import { NotificationService } from "../../../../_services/notification.service";
import { tap } from "rxjs/operators";

@Component({
    selector: "app-shared-roles-table",
    templateUrl: "./roles-table.component.html",
})
export class SharedRolesTableComponent implements OnChanges {

    @Input() modelId;
    @Input() modelName;
    @Input() lazyLoad = true;
    @ViewChild("rolesTable") rolesTable: MatTable<any>;

    selected = []; list = { all: [], filtered: [] };

    constructor(
        private apiService: APIService,
        private notificationService: NotificationService
    ) {}

    ngOnChanges() {
        if(this.lazyLoad === false) { this.get(); }
    }

    public get() {
        // Get team roles
        this.apiService.getRolesByTypeId(this.modelName, this.modelId).subscribe((data: any) => {
            this.selected = data instanceof Array ? data : [];
            this.rolesTable.renderRows();
        });
    }

    async search(name = "") {
        // Get roles list?
        if (this.list.all.length === 0) {
            this.list.all = (await this.apiService.getRoles().toPromise()) as any;
        }

        // Filter roles
        const selectedIds = this.selected.map((item) => item.id);
        this.list.filtered = this.list.all.filter((item) => {
            const itemName = item.name as string;
            const description = item.description as string;
            const fullItem = itemName.toLowerCase() + description.toLowerCase();
            return fullItem.includes(name.toLowerCase()) && !selectedIds.includes(item.id);
        });
    }

    assign($event, rolesSearchInput) {
        // Add role
        this.selected.push($event.option.value);
        this.rolesTable.renderRows();

        // Clear input
        rolesSearchInput.value = "";
        rolesSearchInput.blur();
    }

    revoke(index) {
        // Remove by index
        this.selected.splice(index, 1);
        this.rolesTable.renderRows();
    }

    public save() {
        return this.apiService
            .syncRoleLinks(
                this.selected.map((item) => item.id),
                this.modelName,
                this.modelId
            )
            .pipe(tap((data: any) => {
                // Send message
                if (data.success) {
                    this.notificationService.success("Capabilities updated successfully!");
                } else {
                    this.notificationService.error("An error occurred updating the capabilities");
                }
                return data;
            }));
    }
}

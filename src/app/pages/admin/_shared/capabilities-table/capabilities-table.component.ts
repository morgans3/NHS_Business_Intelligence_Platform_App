import { Component, Input, OnChanges, ViewChild } from "@angular/core";
import { APIService } from "diu-component-library";
import { MatTable } from "@angular/material/table";
import { NotificationService } from "../../../../_services/notification.service";
import { MatDialog } from "@angular/material/dialog";
import { tap } from "rxjs/operators";

@Component({
    selector: "app-shared-capabilties-table",
    templateUrl: "./capabilities-table.component.html",
})
export class SharedCapabilitiesTableComponent implements OnChanges {

    @Input() modelId;
    @Input() modelName;
    @Input() lazyLoad = true;
    @ViewChild("capabilitiesTable") capabilitiesTable: MatTable<any>;

    selected = []; list = { all: [], filtered: [] };

    constructor(
        private dialog: MatDialog,
        private apiService: APIService,
        private notificationService: NotificationService
    ) {}

    ngOnChanges() {
        if(this.lazyLoad === false) { this.get(); }
    }

    public get() {
        // Get team roles
        this.apiService.getCapabilitiesByTypeId(this.modelName, this.modelId).subscribe((data: any) => {
            this.selected = data instanceof Array ? data : [];
            this.capabilitiesTable.renderRows();
        });
    }

    async search(name = "") {
        // Get roles list?
        if (this.list.all.length === 0) {
            this.list.all = (await this.apiService.getCapabilities().toPromise()) as any;
        }

        // Filter roles
        const selectedIds = this.selected.map((item) => item.id);
        this.list.filtered = this.list.all.filter((item) => {
            const itemName = item.name as string;
            const description = item.description as string;
            const fullItem = itemName.toLowerCase() + description.toLowerCase();
            return fullItem.includes(name.toLowerCase()) && !selectedIds.includes(item.id) && item.parent == null;
        });
    }

    assign($event, capabilitiesSearchInput) {
        // Add capability
        new Promise((resolve) => {
            // Get capability
            const capability = $event.option.value;

            // Set value json
            if(capability.value.type === "allow_deny" && !capability.value.type_meta?.children_select) {
                capability.valuejson = "allow";
                this.selected.push(capability);
                resolve(true);
            } else {
                // Handle alternative type
                import("../../../../shared/components/capabilities-select/value-modal/value.modal").then((c) => {
                    // Open modal with data
                    this.dialog.open(c.CapabilityValueModalComponent, {
                        data: { capability }, width: "60%",
                    }).afterClosed().subscribe((data) => {
                        if (data) {
                            // Set value json
                            capability.valuejson = data.valuejson;
                            this.selected.push(capability);

                            // Handle any children
                            if(data?.meta?.children) {
                                data.meta.children.forEach((child) => {
                                    // Get capability info
                                    // eslint-disable-next-line prefer-const
                                    let childCapability = this.list.all.find((item) => item.id === child.id);

                                    // Multiple value jsons?
                                    if (!(child.valuejson instanceof Array)) {
                                        childCapability.valuejson = child.valuejson;
                                        this.selected.push(childCapability);
                                    } else {
                                        child.valuejson.forEach((valuejson) => {
                                            childCapability.valuejson = valuejson;
                                            this.selected.push(JSON.parse(JSON.stringify(childCapability)));
                                        });
                                    }
                                })
                            }
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    });
                });
            }
        }).then(() => {
            // Clear input and render rows
            this.capabilitiesTable.renderRows();
            capabilitiesSearchInput.value = "";
            capabilitiesSearchInput.blur();
        })
    }

    revoke(index) {
        // Remove item
        const removedItem = this.selected[index];

        // Remove children
        this.selected = this.selected.filter((capability) =>
            // eslint-disable-next-line eqeqeq
            !(capability.id == removedItem.id || capability.parent == removedItem.id)
        )

        this.capabilitiesTable.renderRows();
    }

    public save() {
        return this.apiService
            .syncCapabilityLinks(
                this.selected.map((item) => {
                    return { id: item.id, valuejson: item.valuejson }
                }),
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
            }));
    }
}

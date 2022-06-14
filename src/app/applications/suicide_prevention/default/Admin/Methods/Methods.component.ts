import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { FormGroup, Validators, FormControl, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../../_services/notification.service";
import { IncidentMethods } from "../../../../../_models/SPI_Lookups";

@Component({
    selector: "app-Methods",
    templateUrl: "./Methods.component.html",
})
export class MethodsComponent implements OnInit, OnChanges {
    @Input() list: string;
    @Input() displayName: string;
    @Input() inputmethods: IncidentMethods[];
    editForm: IncidentMethods;
    displayedColumns: string[] = ["method", "priority", "dateCreated", "actions"];
    dataSource: MatTableDataSource<IncidentMethods>;
    dataFetched = false;
    myForm = new FormGroup({
        method: new FormControl(null, Validators.required),
        priority: new FormControl("0", Validators.required),
        list: new FormControl(),
    });
    @ViewChild(FormGroupDirective, { static: false }) formDirective: FormGroupDirective;
    form: IncidentMethods;
    dataChanged: false;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    methods: IncidentMethods[] = [];
    @Output() updatedmethods = new EventEmitter<IncidentMethods[]>();

    constructor(private apiService: APIService, private notificationService: NotificationService) {}

    ngOnInit() {
        this.methods = this.inputmethods;
        this.buildTable();
    }

    ngOnChanges() {
        if (this.methods !== this.inputmethods) {
            this.methods = this.inputmethods;
            this.buildTable();
        }
    }

    buildTable() {
        this.dataFetched = true;
        this.dataSource = new MatTableDataSource(this.inputmethods);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    onSubmit() {
        if (this.editForm) {
            // this.myForm.controls["id"].patchValue(this.editForm.id);
            const updateItem = this.methods.filter((x) => x.method === this.myForm.value["method"]);
            if (updateItem.length > 0) {
                updateItem[0].priority = this.myForm.value["priority"];
                updateItem[0].list = this.list;
                this.apiService.updateSpiIncident(updateItem[0]).subscribe(() => {
                    this.methods.splice(
                        this.methods.indexOf(this.methods.filter((x) => x.method === this.myForm.value["method"])[0]),
                        1,
                        this.myForm.value
                    );
                    this.buildTable();
                    this.notificationService.success("Updated record");
                    this.formDirective.resetForm();
                    this.myForm.controls["priority"].setValue("0");
                    this.editForm = null;
                    this.updatedmethods.emit(updateItem);
                });
            } else {
                this.notificationService.error(
                    "Unable to update method name. To change the method you will need to add a new method and remove the previous one."
                );
            }
        } else {
            this.myForm.value["list"] = this.list;
            const item = this.myForm.value;
            item.list = this.list;
            item.dateCreated = new Date().toISOString();
            this.apiService.createSpiIncident(item).subscribe(() => {
                this.methods.push(item);
                this.buildTable();
                this.formDirective.resetForm();
                this.myForm.controls["priority"].setValue("0");
                this.updatedmethods.emit([item]);
            });
        }
    }

    exitEditMode() {
        this.editForm = null;
        this.formDirective.resetForm();
        this.myForm.controls["priority"].setValue("0");
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    updateRecord(row: IncidentMethods) {
        this.editForm = row;
        this.myForm.patchValue(this.editForm);
    }

    removeRecord(row: IncidentMethods) {
        this.apiService.deleteSpiIncident(row).subscribe((res: any) => {
            if (res.error) {
                this.notificationService.warning("Unable to remove method, reason: " + (res.message as string));
            } else {
                this.notificationService.success("Method removed");
                this.methods.splice(this.methods.indexOf(row));
                this.buildTable();
                this.updatedmethods.emit(null);
            }
        });
    }

    trunc(word, n) {
        return word.length > n ? (word.substr(0, n - 1) as string) + "..." : word;
    }
}

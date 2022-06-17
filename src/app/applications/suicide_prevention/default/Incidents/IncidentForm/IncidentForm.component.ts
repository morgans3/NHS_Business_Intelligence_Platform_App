import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { APIService } from "diu-component-library";
import { iLocation, Incident, IncidentMethods } from "../../../../../_models/SPI_Lookups";
import { NotificationService } from "../../../../../_services/notification.service";

@Component({
    selector: "app-IncidentForm",
    templateUrl: "./IncidentForm.component.html",
})
export class IncidentFormComponent implements OnInit {
    inquest_conclusion_vals: IncidentMethods[] = [];
    bereavement_options: IncidentMethods[] = [];
    suicide_type: IncidentMethods[] = [];
    bcu_options: IncidentMethods[] = [];
    coroner_areas: IncidentMethods[] = [];
    csp_districts: IncidentMethods[] = [];
    ics_values: IncidentMethods[] = [];
    ccg_values: IncidentMethods[] = [];
    reporters: IncidentMethods[] = [];
    local_authorities: IncidentMethods[] = [];
    employment_values: IncidentMethods[] = [];
    incidentmethods: IncidentMethods[] = [];
    type_of_location: IncidentMethods[] = [];
    asc_lcc_update: IncidentMethods[] = [];
    cgl_update: IncidentMethods[] = [];
    csp_resident: IncidentMethods[] = [];
    da: IncidentMethods[] = [];
    delphi_update: IncidentMethods[] = [];
    gender: IncidentMethods[] = [];
    vic_perp_both: IncidentMethods[] = [];
    ethnicity: IncidentMethods[] = [];
    mh_services_lscft_update: IncidentMethods[] = [];
    editForm: Incident;
    myForm = new FormGroup({
        index: new FormControl(null, Validators.required),
        ics: new FormControl(null, null),
        type: new FormControl(null, null),
        method: new FormControl(null, null),
        bcu: new FormControl(null, null),
        coroner_area: new FormControl(null, null),
        csp_district: new FormControl(null, null),
        ccg: new FormControl(null, null),
        lancs12: new FormControl(null, null),
        asc_lcc_update: new FormControl(null, null),
        delphi_update: new FormControl(null, null),
        details: new FormControl(null, null),
        ethnicity: new FormControl(null, null),
        cgl_update: new FormControl(null, null),
        da: new FormControl(null, null),
        forename: new FormControl(null, null),
        surname: new FormControl(null, null),
        csp_resident: new FormControl(null, null),
        reported_by: new FormControl(null, null),
        incident_ref: new FormControl(null, null),
        date: new FormControl(null, null),
        type_of_location: new FormControl(null, null),
        local_authority: new FormControl(null, null),
        gender: new FormControl(null, null),
        date_of_birth: new FormControl(null, Validators.required),
        occupation: new FormControl(null, null),
        type_of_job: new FormControl(null, null),
        employment: new FormControl(null, null),
        imd_decile: new FormControl(null, null),
        local: new FormControl(null, null),
        registered_gp_practice: new FormControl(null, null),
        gp_name: new FormControl(null, null),
        medication: new FormControl(null, null),
        bereavement_offered: new FormControl(null, null),
        inquest_conclusion: new FormControl(null, null),
        inquest_date: new FormControl(null, null),
        rts_accurate: new FormControl(null, null),
        medical_history: new FormControl(null, null),
        mh_services_lscft_update: new FormControl(null, null),
        vic_perp_both: new FormControl(null, null),
        location_of_postcode: new FormControl(null, null),
        residence_location: new FormControl(null, null),
    });
    @ViewChild(FormGroupDirective, { static: false }) formDirective: FormGroupDirective;
    form: Incident;
    allsortedmethods: IncidentMethods[] = [];
    medicationlist = [];
    residence_loc: iLocation;
    incident_loc: iLocation;
    read_incident_loc: iLocation;
    read_residence_loc: iLocation;
    incidicentMosType: string;
    postcode_mosaic: string;
    keyToolTip: any;
    mosaicCodes: any[];
    toolTipData: any;
    showToolTip: boolean;

    constructor(
        private apiService: APIService,
        private notificationService: NotificationService,
        public dialog: MatDialog,
        private router: Router
    ) {
        this.apiService.getSpiIncidents().subscribe((res: IncidentMethods[]) => {
            if (res.length > 0) {
                this.allsortedmethods = res.sort((a, b) => {
                    if (parseInt(b.priority) - parseInt(a.priority) === 0) {
                        if (a.method < b.method) {
                            return -1;
                        }
                        if (a.method > b.method) {
                            return 1;
                        }
                        return 0;
                    } else {
                        return parseInt(b.priority) - parseInt(a.priority);
                    }
                });
                this.populateDropdowns();
            } else {
                this.allsortedmethods = [];
            }
        });
        this.apiService.getMosiacs().subscribe((res: any[]) => {
            this.mosaicCodes = res;
            if (this.postcode_mosaic) {
                this.mosaicCodes.forEach((mosaicCode) => {
                    if (mosaicCode.code === this.postcode_mosaic) {
                        this.toolTipData = mosaicCode;
                    }
                });
            }
        });
        this.keyToolTip = document.querySelector(".postcode_mosaic");
    }

    ngOnInit() {
        const locItem = localStorage.getItem("@@selected-incident");
        if (locItem) {
            this.editForm = JSON.parse(locItem);
            this.customParse(this.editForm);
            localStorage.removeItem("@@selected-incident");
        }
        console.log(this);
    }

    populateDropdowns() {
        this.inquest_conclusion_vals = this.allsortedmethods.filter((x) => x.list === "inquest_conclusion");
        this.bereavement_options = this.allsortedmethods.filter((x) => x.list === "bereavement_options");
        this.suicide_type = this.allsortedmethods.filter((x) => x.list === "suicide_type");
        this.bcu_options = this.allsortedmethods.filter((x) => x.list === "bcu_options");
        this.coroner_areas = this.allsortedmethods.filter((x) => x.list === "coroner_areas");
        this.csp_districts = this.allsortedmethods.filter((x) => x.list === "csp_districts");
        this.ics_values = this.allsortedmethods.filter((x) => x.list === "ics_values");
        this.ccg_values = this.allsortedmethods.filter((x) => x.list === "ccg_values");
        this.reporters = this.allsortedmethods.filter((x) => x.list === "reporters");
        this.local_authorities = this.allsortedmethods.filter((x) => x.list === "local_authorities");
        this.employment_values = this.allsortedmethods.filter((x) => x.list === "employment_values");
        this.incidentmethods = this.allsortedmethods.filter((x) => x.list === "method");
        this.type_of_location = this.allsortedmethods.filter((x) => x.list === "location_types");
        this.asc_lcc_update = this.allsortedmethods.filter((x) => x.list === "asc_lcc_update");
        this.cgl_update = this.allsortedmethods.filter((x) => x.list === "cgl_update");
        this.csp_resident = this.allsortedmethods.filter((x) => x.list === "csp_resident");
        this.da = this.allsortedmethods.filter((x) => x.list === "da");
        this.delphi_update = this.allsortedmethods.filter((x) => x.list === "delphi_update");
        this.gender = this.allsortedmethods.filter((x) => x.list === "gender");
        this.vic_perp_both = this.allsortedmethods.filter((x) => x.list === "vic_perp_both");
        this.ethnicity = this.allsortedmethods.filter((x) => x.list === "ethnicity");
        this.mh_services_lscft_update = this.allsortedmethods.filter((x) => x.list === "mh_services_lscft_update");
    }

    customParse(incident: Incident) {
        let incident_location = {};
        try {
            if (incident.location_postcode_data) {
                const incident_location_data = JSON.parse(incident.location_postcode_data);
                if (incident_location_data) {
                    incident_location = {
                        latitude: incident_location_data.latitude,
                        longitude: incident_location_data.longitude,
                        postcode: incident_location_data.postcode,
                    };
                }
            }
        } catch {
            console.error("unable to parse incident postcode data");
        }
        let residence_location = {};
        try {
            const residence_location_data = JSON.parse(incident.postcode_data);
            if (residence_location_data) {
                residence_location = {
                    latitude: residence_location_data.latitude,
                    longitude: residence_location_data.longitude,
                    postcode: residence_location_data.postcode,
                };
            }
        } catch {
            console.error("unable to parse residential postcode data");
        }
        this.myForm.patchValue(incident);
        if (incident.medication) {
            // let medicationList = incident.medication;
            // medicationList = JSON.parse(medicationList);
            // this.medicationlist = incident.medication;
        }
        if (incident_location) {
            this.read_incident_loc = incident_location;
        }
        if (residence_location) {
            this.read_residence_loc = residence_location;
        }
        // if (incident.location_postcode_mosaic) {
        //   this.incidicentMosType = incident.location_postcode_mosaic;
        // }
        if (incident.postcode_mosaic) {
            this.postcode_mosaic = incident.postcode_mosaic;
        }
        console.log(this);
    }

    onSubmit() {
        const item = this.myForm.value;
        if (item.imd_decile) {
            item.imd_decile = item.imd_decile.toString();
        }
        if (this.medicationlist.length > 0) {
            item.medication = this.medicationlist;
        }
        if (this.residence_loc) {
            item.postcode_data = JSON.stringify(this.residence_loc);
        }
        if (this.incident_loc) {
            item.location_postcode_data = JSON.stringify(this.incident_loc);
        }
        if (item.date && item.date_of_birth) {
            item.age = this.getAge(item.date, item.date_of_birth);
            item.age_group = this.getAgeGroup(item.age);
        }
        if (this.postcode_mosaic) {
            item.postcode_mosaic = this.postcode_mosaic;
        }
        if (this.editForm) {
            item.index = this.editForm.index;
            item.ics = this.editForm.ics;
            this.apiService.updateIncident(item).subscribe((data: any) => {
                if (data.success && data.success === false) {
                    this.notificationService.error("Unable to update Incident, reason: " + (data.msg as string));
                } else {
                    this.formDirective.resetForm();
                    this.medicationlist = [];
                    this.editForm = null;
                    this.notificationService.success("Updated record");
                    this.router.navigate(["/apps/suicide-prevention/incidents"]);
                }
            });
        } else {
            this.apiService.createIncident(item).subscribe((data: any) => {
                if (data.success && data.success === false) {
                    this.notificationService.error("Unable to update Incident, reason: " + (data.msg as string));
                } else {
                    this.formDirective.resetForm();
                    this.medicationlist = [];
                    this.editForm = null;
                    this.notificationService.success("record created");
                    this.router.navigate(["/apps/suicide-prevention/incidents"]);
                }
            });
        }
    }

    exitEditMode() {
        this.editForm = null;
        this.formDirective.resetForm();
        this.medicationlist = [];
    }

    removeMedication(medication) {
        this.medicationlist.splice(this.medicationlist.indexOf(medication), 1);
    }

    addMedication() {
        const dialogApp = this.dialog.open(AddMedicationDialogComponent, {
            width: "450px",
            data: null,
        });
        dialogApp.afterClosed().subscribe((medication: any) => {
            if (medication) {
                this.medicationlist.push(medication);
            }
        });
    }

    getAge(incidentData, dateOfBirth) {
        const today = new Date(incidentData);
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    getAgeGroup(age) {
        if (age >= 100) {
            return "100+";
        } else if (age >= 95) {
            return "95-99";
        } else if (age >= 90) {
            return "90-94";
        } else if (age >= 85) {
            return "85-89";
        } else if (age >= 80) {
            return "80-84";
        } else if (age >= 75) {
            return "75-79";
        } else if (age >= 70) {
            return "70-74";
        } else if (age >= 65) {
            return "65-69";
        } else if (age >= 60) {
            return "60-64";
        } else if (age >= 55) {
            return "55-59";
        } else if (age >= 50) {
            return "50-54";
        } else if (age >= 45) {
            return "45-49";
        } else if (age >= 40) {
            return "40-44";
        } else if (age >= 35) {
            return "35-39";
        } else if (age >= 30) {
            return "30-34";
        } else if (age >= 25) {
            return "25-29";
        } else if (age >= 20) {
            return "20-24";
        } else if (age >= 15) {
            return "15-19";
        } else if (age >= 10) {
            return "10-14";
        } else {
            return "under 10";
        }
    }

    updateResidence(newlocation) {
        this.residence_loc = newlocation;
    }

    updateLocation(newlocation) {
        this.incident_loc = newlocation;
    }

    changeMosType(event) {
        this.postcode_mosaic = event;
    }
}

@Component({
    selector: "dialog-addmedication",
    templateUrl: "dialogaddmedication.html",
})
export class AddMedicationDialogComponent {
    myForm = new FormGroup({
        text: new FormControl(null),
    });
    constructor(public dialogRef: MatDialogRef<AddMedicationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    onAddClick() {
        this.dialogRef.close(this.myForm.controls["text"].value);
    }
}

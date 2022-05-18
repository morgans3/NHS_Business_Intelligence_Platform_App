import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { Store } from "@ngxs/store";
import { Router } from "@angular/router";

import { PopulationPerson } from "diu-component-library";
import { AuthState } from "../../../../_states/auth.state";
import { NotificationService } from "../../../../_services/notification.service";
import { decodeToken } from "../../../../_pipes/functions";

@Component({
    selector: "app-patient-list",
    templateUrl: "./patient-list.component.html",
    styleUrls: ["./patient-list.component.scss"],
})
export class PatientListComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ["fullname", "nhsnumber", "age", "sex", "rsk", "ccg", "gp", "actions"];
    dataSource: MatTableDataSource<PopulationPerson>;
    dataFetched = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    tokenDecoded: any;
    bookmarks = [];
    sensitiveData = false;

    exampleGroup = [
        {
            fullname: "Stewart Morgan",
            nhsnumber: "1472 258 369",
            age: 25,
            rsk: 12,
            sex: "Male",
            ccg: "00R",
            gp: "Bloomfield Practice",
        },
        {
            fullname: "Homer Simpson",
            nhsnumber: "3692 581 471",
            age: 35,
            rsk: 21,
            sex: "Male",
            ccg: "00R",
            gp: "Bloomfield Practice",
        },
        {
            fullname: "Darth Vader",
            nhsnumber: "1472 589 631",
            age: 43,
            rsk: 2,
            sex: "Male",
            ccg: "00R",
            gp: "Bloomfield Practice",
        },
        {
            fullname: "Tony Stark",
            nhsnumber: "3000 999 111",
            age: 48,
            rsk: 84,
            sex: "Male",
            ccg: "00R",
            gp: "Bloomfield Practice",
        },
        {
            fullname: "Thanos",
            nhsnumber: "0101 101 101",
            age: 16,
            rsk: 3,
            sex: "Male",
            ccg: "00R",
            gp: "Bloomfield Practice",
        },
    ];

    constructor(public store: Store, private router: Router, private notificationService: NotificationService) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            this.tokenDecoded = decodeToken(token);
        }
    }

    ngOnInit() {
        this.getData();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    getData() {
        this.dataFetched = false;
        const criteria = {};
        const data = this.addTestPatients();
        // this.service
        //   .getPopulationList(criteria)
        //   .subscribe((data: PopulationPerson[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataFetched = true;
        //   });
    }

    addTestPatients(): PopulationPerson[] {
        const testers = [];
        if (this.sensitiveData) {
            this.exampleGroup.forEach((example) => {
                testers.push(example);
            });
            for (let i = 0; i < 426; i++) {
                testers.push({
                    fullname: "##### #####",
                    nhsnumber: "#### ### ###",
                    age: 99,
                    rsk: 99,
                    sex: "Unknown",
                    ccg: "Test CCG",
                    gp: "Test GP",
                });
            }
        } else {
            for (let i = 0; i < 431; i++) {
                testers.push({
                    fullname: "##### #####",
                    nhsnumber: "#### ### ###",
                    age: 99,
                    rsk: 99,
                    sex: "Unknown",
                    ccg: "Test CCG",
                    gp: "Test GP",
                });
            }
        }
        return testers;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    personSelected(row) {
        this.router.navigate(["/person"]);
    }

    personBookmarked(row, i: number) {
        console.log(row);
        console.log(i);
        // TODO: NEEDS WORK
        if (this.bookmarks.indexOf(i) > -1) {
            this.bookmarks.splice(this.bookmarks.indexOf(i), 1);
        } else {
            this.bookmarks.push(i);
        }
    }

    updatePID(event) {
        console.log(event);
        if (event) {
            this.tokenDecoded = event;
            if (this.tokenDecoded.mfa) {
                this.sensitiveData = true;
            } else {
                this.sensitiveData = false;
            }
            this.getData();
        } else {
            this.notificationService.warning("Authentication error: no new passport attached.");
        }
    }
}

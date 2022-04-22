import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { APIService } from "diu-component-library";

@Component({
  selector: "app-users-table",
  templateUrl: "./users-table.component.html",
})
export class UsersTableComponent implements OnInit {
  users: any;

  constructor(private apiService: APIService) {}

  ngOnInit() {
    // this.apiService.getUsers().subscribe((users) => {
    //     this.users = users;
    // })
  }
}

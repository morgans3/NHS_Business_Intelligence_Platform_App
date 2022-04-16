import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserGroupService } from "diu-component-library";

@Component({
  selector: "app-users-table",
  templateUrl: "./users-table.component.html",
})
export class UsersTableComponent implements OnInit {
  users: any;

  constructor(private userGroupService: UserGroupService) {}

  ngOnInit() {
    // this.userGroupService.getUsers().subscribe((users) => {
    //     this.users = users;
    // })
  }
}

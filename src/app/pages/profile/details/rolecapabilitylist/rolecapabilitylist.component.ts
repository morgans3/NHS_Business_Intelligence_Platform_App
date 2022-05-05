import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { iRole, iCapability, APIService, iRoleLink, iCapabilityLink } from "diu-component-library";

// TODO: Add search functionality
// TODO: roles and capability lists can be split into a single component, re-used for both lists
// TODO: when happy with how its all working, shift into diu-component-library

@Component({
  selector: "app-rolecapabilitylist",
  templateUrl: "./rolecapabilitylist.component.html",
})
export class RoleCapabilityListComponent implements OnInit, OnChanges {
  @Input() username: string = null;
  @Input() teamcode: string = null;
  lastchecked: string = null;
  allRoles: iRole[] = [];
  allCapabilities: iCapability[] = [];
  assignedRoles: iRoleLink[] = [];
  assignedCapabilties: iCapabilityLink[] = [];

  constructor(private apiService: APIService) {
    this.getLists();
  }

  ngOnInit() {
    this.populateLists();
  }

  ngOnChanges() {
    if (this.lastchecked !== this.username || this.lastchecked !== this.teamcode) {
      this.populateLists();
      this.lastchecked = this.username || this.teamcode;
    }
  }

  getLists() {
    // TODO: populate allRoles from API
    // TODO: populate allCapabilties from API
  }

  populateLists() {
    if (this.username) {
      // TODO: get all user capabiltiies and roles from API, then update assignedRoles and assignedCapabilties
    } else if (this.teamcode) {
      // TODO: get all team capabiltiies and roles from API, then update assignedRoles and assignedCapabilties
    }
  }

  unassign(item: iRole | iCapability) {
    // TODO: remove link for this item
  }

  request(item: iRole | iCapability) {
    // TODO: remove link for this item
  }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../../../../demo-material-module";
import { DiuComponentLibraryModule } from "diu-component-library";

@NgModule({
  imports: [CommonModule, DemoMaterialModule, DiuComponentLibraryModule],
  declarations: [RoleCapabilityListComponent],
  exports: [RoleCapabilityListComponent],
})
export class RoleCapabilityListModule {}

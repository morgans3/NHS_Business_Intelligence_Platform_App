/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { DemoMaterialModule } from "src/app/demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { ResizeService, APIService } from "diu-component-library";
import { TeamMembersComponent } from "./team-members.component";
import { NotificationService } from "src/app/_services/notification.service";
import { AuthState } from "src/app/_states/auth.state";
import { NgxsModule } from "@ngxs/store";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule, ToastrService } from "ngx-toastr";

describe("TeamMembersComponent", () => {
  let component: TeamMembersComponent;
  let fixture: ComponentFixture<TeamMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DemoMaterialModule, FlexLayoutModule, CommonModule, NgxsModule.forRoot([AuthState]), BrowserAnimationsModule, HttpClientModule, ToastrModule.forRoot()],
      providers: [APIService, ResizeService, NotificationService, ToastrService],
      declarations: [TeamMembersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

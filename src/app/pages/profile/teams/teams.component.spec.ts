/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { DiuComponentLibraryModule, UserGroupService } from "diu-component-library";
import { NotificationService } from "src/app/_services/notification.service";
import { ProfileTeamsComponent } from "./teams.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxsModule } from "@ngxs/store";
import { AuthState } from "src/app/_states/auth.state";
import { ReferenceState } from "src/app/_states/reference.state";

describe("ProfileTeamsComponent", () => {
  let component: ProfileTeamsComponent;
  let fixture: ComponentFixture<ProfileTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, DemoMaterialModule, FlexLayoutModule, DiuComponentLibraryModule, HttpClientModule, BrowserAnimationsModule, NgxsModule.forRoot([AuthState, ReferenceState]), ToastrModule.forRoot()],
      providers: [UserGroupService, NotificationService, ToastrService],
      declarations: [ProfileTeamsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
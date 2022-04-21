/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { DiuComponentLibraryModule, UserGroupService } from "diu-component-library";
import { NotificationService } from "src/app/_services/notification.service";
import { ProfileComponent } from "./profile.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxsModule } from "@ngxs/store";
import { AuthState } from "src/app/_states/auth.state";
import { ReferenceState } from "src/app/_states/reference.state";
import { RouterTestingModule } from "@angular/router/testing";

describe("ProfileComponent", () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, DemoMaterialModule, FlexLayoutModule, DiuComponentLibraryModule, HttpClientModule, BrowserAnimationsModule, NgxsModule.forRoot([AuthState, ReferenceState]), ToastrModule.forRoot(), RouterTestingModule],
      providers: [UserGroupService, NotificationService, ToastrService],
      declarations: [ProfileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
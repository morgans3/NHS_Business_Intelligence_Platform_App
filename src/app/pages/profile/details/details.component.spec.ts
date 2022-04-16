/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { DiuComponentLibraryModule, UserGroupService } from "diu-component-library";
import { ProfileDetailsComponent } from "./details.component";
import { NotificationService } from "src/app/_services/notification.service";
import { DynAPIService } from "src/app/_services/dynapi.service";
import { PasswordResetService } from "src/app/layouts/password-reset/password-reset.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxsModule } from "@ngxs/store";
import { ReferenceState } from "src/app/_states/reference.state";
import { HttpClientModule } from "@angular/common/http";

describe("ProfileDetailsComponent", () => {
  let component: ProfileDetailsComponent;
  let fixture: ComponentFixture<ProfileDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, DemoMaterialModule, FlexLayoutModule, DiuComponentLibraryModule, RouterTestingModule, BrowserAnimationsModule, NgxsModule.forRoot([ReferenceState]), HttpClientModule, ToastrModule.forRoot()],
      providers: [UserGroupService, NotificationService, DynAPIService, PasswordResetService, ToastrService],
      declarations: [ProfileDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

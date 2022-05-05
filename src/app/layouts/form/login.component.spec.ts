/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { APIService } from "src/app/_services/notification.service";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { RouterTestingModule } from "@angular/router/testing";
import { NgxsModule } from "@ngxs/store";
import { ReferenceState } from "src/app/_states/reference.state";
import { AuthState } from "src/app/_states/auth.state";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "src/app/pages/forms/login/login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // private store: Store
      imports: [DemoMaterialModule, FlexLayoutModule, CommonModule, ToastrModule.forRoot(), RouterTestingModule, HttpClientModule, NgxsModule.forRoot([AuthState, ReferenceState]), BrowserAnimationsModule],
      providers: [APIService, ToastrService],
      declarations: [LoginComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

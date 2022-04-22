/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DemoMaterialModule } from "src/app/demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { APIService } from "diu-component-library";
import { FullComponent } from "./full.component";
import { NotificationService } from "src/app/_services/notification.service";
import { HttpClientModule } from "@angular/common/http";
import { AuthState } from "src/app/_states/auth.state";
import { AlertState } from "src/app/_states/alert.state";
import { NgxsModule } from "@ngxs/store";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";

describe("FullComponent", () => {
  let component: FullComponent;
  let fixture: ComponentFixture<FullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // public store: Store
      imports: [DemoMaterialModule, FlexLayoutModule, CommonModule, HttpClientModule, NgxsModule.forRoot([AuthState, AlertState]), ToastrModule.forRoot(), BrowserAnimationsModule, RouterTestingModule],
      providers: [APIService, ToastrService, NotificationService],
      declarations: [FullComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

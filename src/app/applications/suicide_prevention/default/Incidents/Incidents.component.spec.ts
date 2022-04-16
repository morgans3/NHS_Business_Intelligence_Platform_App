/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { RouterTestingModule } from "@angular/router/testing";
import { IncidentsComponent } from "./Incidents.component";
import { FormsModule } from "@angular/forms";
import { StorageService } from "../../_services/storage.service";
import { NotificationService } from "../../_services/notification.service";
import { MaterialModule } from "../../material/material.module";
import { ReferenceService } from "../../_services/reference.service";
import { NgxsModule } from "@ngxs/store";
import { AuthState } from "../../_states/auth.state";

describe("IncidentsComponent", () => {
  let component: IncidentsComponent;
  let fixture: ComponentFixture<IncidentsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MaterialModule, ToastrModule.forRoot(), HttpClientModule, FormsModule, RouterTestingModule, NgxsModule.forRoot([AuthState])],
      providers: [NotificationService, ToastrService, StorageService, ReferenceService],
      declarations: [IncidentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

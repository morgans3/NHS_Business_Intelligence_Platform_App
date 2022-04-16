/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { MaterialModule } from "../../material/material.module";
import { NotificationService } from "../../_services/notification.service";
import { ReferenceService } from "../../_services/reference.service";
import { AdminComponent } from "./Admin.component";
import { MethodsComponent } from "./Methods/Methods.component";

describe("AdminComponent", () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MaterialModule, ToastrModule.forRoot(), HttpClientModule, ReactiveFormsModule, FormsModule],
      providers: [NotificationService, ReferenceService, ToastrService],
      declarations: [AdminComponent, MethodsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { MaterialModule } from "../../../material/material.module";
import { NotificationService } from "../../../_services/notification.service";
import { ReferenceService } from "../../../_services/reference.service";
import { MethodsComponent } from "./Methods.component";

describe("MethodsComponent", () => {
  let component: MethodsComponent;
  let fixture: ComponentFixture<MethodsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MaterialModule, ToastrModule.forRoot(), HttpClientModule, FormsModule],
      providers: [NotificationService, ReferenceService, ToastrService],
      declarations: [MethodsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

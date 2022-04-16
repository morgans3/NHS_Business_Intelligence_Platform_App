/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { MaterialModule } from "../../../../material/material.module";
import { NotificationService } from "../../../../_services/notification.service";
import { PostcodeService } from "../../../../_services/postcodes.service";
import { FindMosaicComponent } from "./findMosaic.component";

describe("FindMosaicComponent", () => {
  let component: FindMosaicComponent;
  let fixture: ComponentFixture<FindMosaicComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MaterialModule, ToastrModule.forRoot(), HttpClientModule],
      providers: [NotificationService, PostcodeService, ToastrService],
      declarations: [FindMosaicComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindMosaicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

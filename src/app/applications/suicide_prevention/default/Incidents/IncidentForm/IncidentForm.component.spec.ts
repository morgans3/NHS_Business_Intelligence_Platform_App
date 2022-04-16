/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { MaterialModule } from "../../../material/material.module";
import { DynApiService } from "../../../_services/dynapi.service";
import { NotificationService } from "../../../_services/notification.service";
import { PostcodeService } from "../../../_services/postcodes.service";
import { StorageService } from "../../../_services/storage.service";
import { FindlocationComponent } from "./findlocation/findlocation.component";
import { FindMosaicComponent } from "./findMosaic/findMosaic.component";
import { IncidentFormComponent } from "./IncidentForm.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ReferenceService } from "../../../_services/reference.service";
import { FormsModule } from "@angular/forms";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";

describe("IncidentFormComponent", () => {
  let component: IncidentFormComponent;
  let fixture: ComponentFixture<IncidentFormComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MaterialModule, ToastrModule.forRoot(), HttpClientModule, RouterTestingModule, FormsModule, LeafletModule.forRoot(), LeafletDrawModule.forRoot()],
      providers: [NotificationService, PostcodeService, ToastrService, StorageService, DynApiService, ReferenceService],
      declarations: [IncidentFormComponent, FindlocationComponent, FindMosaicComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

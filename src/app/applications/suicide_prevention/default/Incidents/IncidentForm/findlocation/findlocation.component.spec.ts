/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { MaterialModule } from "../../../../material/material.module";
import { MapComponent } from "../../../../_components/map.component";
import { NotificationService } from "../../../../_services/notification.service";
import { PostcodeService } from "../../../../_services/postcodes.service";
import { FindlocationComponent } from "./findlocation.component";

describe("FindlocationComponent", () => {
  let component: FindlocationComponent;
  let fixture: ComponentFixture<FindlocationComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MaterialModule, ToastrModule.forRoot(), HttpClientModule, ReactiveFormsModule, FormsModule, LeafletModule.forRoot(), LeafletDrawModule.forRoot()],
      providers: [NotificationService, PostcodeService, ToastrService],
      declarations: [FindlocationComponent, MapComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindlocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { APIService } from "diu-component-library";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { NotificationService } from "src/app/_services/notification.service";
import { PostcodeService } from "src/app/_services/postcodes.service";
import { MapComponent } from "../../../../_components/map.component";
import { FindlocationComponent } from "./findlocation.component";

describe("FindlocationComponent", () => {
    let component: FindlocationComponent;
    let fixture: ComponentFixture<FindlocationComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                DemoMaterialModule,
                ToastrModule.forRoot(),
                HttpClientModule,
                ReactiveFormsModule,
                FormsModule,
                LeafletModule.forRoot(),
                LeafletDrawModule.forRoot(),
            ],
            providers: [APIService, PostcodeService, ToastrService, NotificationService],
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

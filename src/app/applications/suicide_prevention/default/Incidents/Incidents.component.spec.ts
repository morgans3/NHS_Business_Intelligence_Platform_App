/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { RouterTestingModule } from "@angular/router/testing";
import { IncidentsComponent } from "./Incidents.component";
import { FormsModule } from "@angular/forms";
import { NgxsModule } from "@ngxs/store";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { APIService } from "diu-component-library";
import { AuthState } from "src/app/_states/auth.state";

describe("IncidentsComponent", () => {
    let component: IncidentsComponent;
    let fixture: ComponentFixture<IncidentsComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                DemoMaterialModule,
                ToastrModule.forRoot(),
                HttpClientModule,
                FormsModule,
                RouterTestingModule,
                NgxsModule.forRoot([AuthState]),
            ],
            providers: [APIService, ToastrService],
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

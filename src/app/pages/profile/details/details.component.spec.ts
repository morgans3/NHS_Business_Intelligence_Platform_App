/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { DiuComponentLibraryModule, APIService } from "diu-component-library";
import { ProfileDetailsComponent } from "./details.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxsModule } from "@ngxs/store";
import { ReferenceState } from "src/app/_states/reference.state";
import { HttpClientModule } from "@angular/common/http";

describe("ProfileDetailsComponent", () => {
    let component: ProfileDetailsComponent;
    let fixture: ComponentFixture<ProfileDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                DemoMaterialModule,
                FlexLayoutModule,
                DiuComponentLibraryModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                NgxsModule.forRoot([ReferenceState]),
                HttpClientModule,
                ToastrModule.forRoot(),
            ],
            providers: [APIService, APIService, ToastrService],
            declarations: [ProfileDetailsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

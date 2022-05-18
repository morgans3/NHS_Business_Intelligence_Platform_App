/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RoleCapabilityListComponent } from "./rolecapabilitylist.component";

describe("RolecapabilitylistComponent", () => {
    let component: RoleCapabilityListComponent;
    let fixture: ComponentFixture<RoleCapabilityListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoleCapabilityListComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoleCapabilityListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

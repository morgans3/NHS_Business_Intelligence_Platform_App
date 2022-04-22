/* tslint:disable:no-unused-variable */
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APIService } from "diu-component-library";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DemoMaterialModule } from "src/app/demo-material-module";
import { MethodsComponent } from "./Methods.component";

describe("MethodsComponent", () => {
  let component: MethodsComponent;
  let fixture: ComponentFixture<MethodsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, DemoMaterialModule, ToastrModule.forRoot(), HttpClientModule, FormsModule],
      providers: [APIService, ToastrService],
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

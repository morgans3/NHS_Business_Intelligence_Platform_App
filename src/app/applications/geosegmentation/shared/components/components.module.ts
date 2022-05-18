import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgModule } from "@angular/core";
import { LightboxModule } from "ngx-lightbox";
import { DynamicComponentDirective } from "./page-content/dynamic-component/dynamic-component.directive";
import { DynamicFieldDirective } from "./form-content/dynamic-field/dynamic-field.directive";
import { DynamicFormComponent } from "./form-content/dynamic-form/dynamic-form.component";
import { RadiobuttonComponent } from "./form-content/radiobutton/radiobutton.component";
import { SelectComponent } from "./form-content/select/select.component";
import { ButtonComponent } from "./form-content/button/button.component";
import { DateComponent } from "./form-content/date/date.component";
import { InputComponent } from "./form-content/input/input.component";
import { CardComponent } from "./page-content/card/card.component";
import { CardTitleComponent } from "./page-content/cardtitle/cardtitle.component";
import { FormComponent } from "./page-content/form/form.component";
import { CheckboxComponent } from "./form-content/checkbox/checkbox.component";
import { HeaderComponent } from "./page-content/header/header.component";
import { ParagraphComponent } from "./page-content/paragraph/paragraph.component";
import { SpanComponent } from "./page-content/span/span.component";
import { DividerComponent } from "./page-content/divider/divider.component";
import { IconComponent } from "./page-content/icon/icon.component";
import { ImageComponent } from "./page-content/image/image.component";
import { ChipListComponent } from "./page-content/chip/chiplist.component";
import { OrderedlistComponent } from "./page-content/orderedlist/orderedlist.component";
import { UnorderedlistComponent } from "./page-content/unorderedlist/unorderedlist.component";
import { MatlistComponent } from "./page-content/mat-list/matlist.component";
import { MatselectionlistComponent } from "./page-content/mat-list/matselectionlist.component";
import { VerticaltabsComponent } from "./page-content/verticaltabs/verticaltabs.component";
import { DemoMaterialModule } from "../../../../demo-material-module";
import { RepeaterTableComponent } from "./form-content/repeater-table/repeater-table.component";
import { SignatureComponent } from "./form-content/signature/signature.component";
import { SignaturePadModule } from "angular-signaturepad";
import { FormParagraphComponent } from "./form-content/formparagraph/formparagraph.component";
import { FormHeaderComponent } from "./form-content/formheader/formheader.component";
import { FormLinkComponent } from "./form-content/formlink/formlink.component";
import { FormBulletListComponent } from "./form-content/formbulletlist/formbulletlist.component";
import { FormNumberListComponent } from "./form-content/formnumberlist/formnumberlist.component";
import { LinkComponent } from "./page-content/link/link.component";
import { StepperComponent } from "./page-content/stepper/stepper.component";
import { StepComponent } from "./page-content/stepper/step.component";
import { StatCardComponent } from "./page-content/stat-card/stat-card.component";
import { MapComponent } from "./page-content/map/map.component";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { DynamicD3ChartDirective } from "./page-content/d3-chart/d3chart.directive";
import { PieChartComponent } from "./page-content/d3-chart/piechart.component";
import { BarChartComponent } from "./page-content/d3-chart/barchart.component";
import { DomChangeDirective } from "./domchange.directive";
import { LeafletMarkerClusterModule } from "@asymmetrik/ngx-leaflet-markercluster";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        DemoMaterialModule,
        FlexLayoutModule,
        LightboxModule,
        SignaturePadModule,
        LeafletModule,
        LeafletDrawModule,
        LeafletMarkerClusterModule,
    ],
    declarations: [
        DynamicD3ChartDirective,
        DynamicComponentDirective,
        DynamicFieldDirective,
        DynamicFormComponent,
        RadiobuttonComponent,
        SelectComponent,
        ButtonComponent,
        CheckboxComponent,
        DateComponent,
        InputComponent,
        CardComponent,
        CardTitleComponent,
        FormComponent,
        HeaderComponent,
        ParagraphComponent,
        SpanComponent,
        DividerComponent,
        IconComponent,
        ImageComponent,
        ChipListComponent,
        OrderedlistComponent,
        UnorderedlistComponent,
        MatlistComponent,
        MatselectionlistComponent,
        VerticaltabsComponent,
        RepeaterTableComponent,
        SignatureComponent,
        FormParagraphComponent,
        FormHeaderComponent,
        FormLinkComponent,
        FormBulletListComponent,
        FormNumberListComponent,
        LinkComponent,
        StepperComponent,
        StepComponent,
        StatCardComponent,
        MapComponent,
        PieChartComponent,
        BarChartComponent,
        DomChangeDirective,
    ],
    entryComponents: [
        RadiobuttonComponent,
        SelectComponent,
        ButtonComponent,
        CheckboxComponent,
        DateComponent,
        InputComponent,
        CardComponent,
        CardTitleComponent,
        FormComponent,
        HeaderComponent,
        ParagraphComponent,
        SpanComponent,
        DividerComponent,
        IconComponent,
        ImageComponent,
        ChipListComponent,
        OrderedlistComponent,
        UnorderedlistComponent,
        MatlistComponent,
        MatselectionlistComponent,
        VerticaltabsComponent,
        RepeaterTableComponent,
        SignatureComponent,
        FormParagraphComponent,
        FormHeaderComponent,
        FormLinkComponent,
        FormBulletListComponent,
        FormNumberListComponent,
        LinkComponent,
        StepperComponent,
        StepComponent,
        StatCardComponent,
        MapComponent,
        PieChartComponent,
        BarChartComponent,
    ],
    exports: [
        DynamicD3ChartDirective,
        DynamicFormComponent,
        DynamicComponentDirective,
        RepeaterTableComponent,
        StatCardComponent,
        MapComponent,
        DomChangeDirective,
    ],
})
export class ComponentsModule {}

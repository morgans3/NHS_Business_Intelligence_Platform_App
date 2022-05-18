import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgModule } from "@angular/core";
import { LightboxModule } from "ngx-lightbox";
import { DomChangeDirective } from "./domchange.directive";
import { LeafletMarkerClusterModule } from "@asymmetrik/ngx-leaflet-markercluster";

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, FormsModule, FlexLayoutModule, LightboxModule, LeafletMarkerClusterModule],
    declarations: [DomChangeDirective],
    exports: [DomChangeDirective],
})
export class ComponentsModule {}

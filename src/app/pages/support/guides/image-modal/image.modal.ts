import { Component, Input } from "@angular/core";

@Component({
    selector: "app-image-modal",
    templateUrl: "./image.modal.html",
})
export class ImageModalComponent {
    @Input() imageUrl;

    constructor() {}
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccordionLinkModule } from "../../../../shared/accordion/accordionLinkModule";
import { DemoMaterialModule } from "../../../../demo-material-module";

@NgModule({
    imports: [CommonModule, AccordionLinkModule, DemoMaterialModule],
    declarations: [ImageModalComponent],
})
export class ImageModalComponentModule {}

import { AfterViewInit, Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "app-form-layout",
    templateUrl: "./form.component.html",
    styleUrls: ["./form.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class FormLayoutComponent implements AfterViewInit {

    constructor() {}

    ngAfterViewInit() {
        const video: any = document.getElementById("the-background");
        video.oncanplaythrough = function () {
            video.muted = true;
            video.play();
        };
    }
}

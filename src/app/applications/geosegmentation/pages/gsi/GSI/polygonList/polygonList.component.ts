import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-polygonList",
    templateUrl: "./polygonList.component.html",
    styleUrls: ["./polygonList.component.scss"],
})
export class PolygonListComponent {
    @Input() inputArray: any;
    @Input() inputTitle: string;
    @Input() secondary: boolean;
    @Output() changeMade = new EventEmitter();

    constructor() {}

    checkClicked(item, value, type) {
        this.changeMade.emit({ name: item, target: type, value: !value });
    }
}

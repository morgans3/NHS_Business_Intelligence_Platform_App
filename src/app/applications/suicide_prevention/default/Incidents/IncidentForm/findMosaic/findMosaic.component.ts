import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { APIService } from "diu-component-library";
import { NotificationService } from "src/app/_services/notification.service";

@Component({
    selector: "app-findMosaic",
    templateUrl: "./findMosaic.component.html",
})
export class FindMosaicComponent implements OnChanges {
    @Input() inputPostcode: string;
    @Input() inputMosType?: string;
    postcode: string;
    mosType: string;
    @Output() outputMosType = new EventEmitter<string>();

    constructor(private referenceService: APIService, private notificationService: NotificationService) {}

    ngOnChanges() {
        if (this.inputPostcode) {
            this.postcode = this.inputPostcode;
        }
        if (this.inputMosType) {
            this.mosType = this.inputMosType;
        }
    }

    findMosaicType() {
        this.mosType = null;
        if (this.postcode) {
            this.referenceService.getCodefromPostCode(this.postcode).subscribe(
                (res: any) => {
                    if (res === "No codes match provided postcode.") {
                        this.notificationService.warning("No Mosiac Type found, default added");
                    } else if (res.length > 0) {
                        this.mosType = res[0].mostype;
                    }
                    this.outputMosType.emit(this.mosType);
                },
                (error) => {
                    this.notificationService.warning("No Mosiac Type found, default added");
                    this.mosType = "U99";
                    this.outputMosType.emit(this.mosType);
                }
            );
        } else {
            this.notificationService.warning("No Postcode provided");
        }
    }

    clearMosaicType() {
        this.mosType = null;
        this.outputMosType.emit(this.mosType);
    }
}

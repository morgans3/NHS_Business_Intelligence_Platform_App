import { Component, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";
import { Router } from "@angular/router";

import { APIService, MosaicCode } from "diu-component-library";
import { decodeToken } from "../../../../_pipes/functions";
import { AuthState } from "../../../../_states/auth.state";

@Component({
    selector: "app-ph-patient",
    templateUrl: "./patient.component.html",
})
export class PatientComponent implements OnInit {
    dataFetched = true; // false; change when plugged into datasource
    tokenDecoded: any;

    inputLng = "-3.015379";
    inputLat = "53.821978";
    mosaicCodeForTest = "L50";
    mosaicCodes: MosaicCode[];

    constructor(public store: Store, private router: Router, private apiService: APIService) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            this.tokenDecoded = decodeToken(token);
        }
    }

    ngOnInit() {
        this.apiService.getMosiacs().subscribe((res: MosaicCode[]) => {
            this.mosaicCodes = res;
            document.getElementById("mosaicTile").innerHTML = this.tiphtml(
                this.mosaicCodeForTest,
                this.mosaicCodes.find((x) => x.code === this.mosaicCodeForTest)
            );
        });
    }

    returnToList() {
        this.router.navigate(["/population-list"]);
    }

    tiphtml(d, mosaic) {
        const usedMosaicType = d;
        let output = "";
        output = "	<div id='mosaicToolTip' class='container d3-tip mosaic-" + usedMosaicType.substr(0, 1) + "'>";
        output += "		<div fxLayout='row wrap'>";
        output += "			<div>";
        output += "<h2>" + usedMosaicType + "</h2>";
        output += "			</div>";
        output += "			<div>";
        output += "<h5>" + mosaic.name + "</h5>";
        output += "			</div>";
        output += "		</div>";
        output += "			<div fxLayout='row wrap'>";
        output += "		<div fxFlex.gt-sm='100' fxFlex.gt-xs='100' fxFlex='100'>";
        output += "<h6>" + mosaic.desc + "</h6>";
        output += "			</div>";
        output += "		</div>";
        output += "			<div fxLayout='row wrap'>";
        output += "		<div fxFlex.gt-sm='100' fxFlex.gt-xs='100' fxFlex='100'>";
        output += `<img alt="image" class="img-container" src="assets/images/mosaic/mosaic_` + usedMosaicType + `.jpg">`;
        output += "			</div>";
        output += "		</div>";
        output += "			<div fxLayout='row wrap'>";
        output += "		<div fxFlex.gt-sm='100' fxFlex.gt-xs='100' fxFlex='100'>";
        output += "<ul>";
        output += "<li>" + mosaic.Feat1 + "</li >";
        output += "<li>" + mosaic.Feat2 + "</li >";
        output += "<li>" + mosaic.Feat3 + "</li >";
        output += "<li>" + mosaic.Feat4 + "</li >";
        output += "<li>" + mosaic.Feat5 + "</li >";
        output += "<li>" + mosaic.Feat6 + "</li >";
        output += "<ul>";
        output += "			</div>";
        output += "		</div>";
        output += "	</div>";

        return output;
    }
}

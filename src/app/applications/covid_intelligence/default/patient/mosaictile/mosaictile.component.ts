import { Component, OnInit, OnChanges, Input } from "@angular/core";
import { PatientLinked, MosaicCode, APIService } from "diu-component-library";

@Component({
  selector: "app-mosaictile",
  templateUrl: "./mosaictile.component.html",
  styleUrls: ["./mosaictile.component.scss"],
})
export class MosaictileComponent implements OnInit, OnChanges {
  
  @Input() setperson: PatientLinked;
  person: PatientLinked;
  mosaicCodes: MosaicCode[];

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.apiService.getMosiacs().subscribe((res: MosaicCode[]) => {
      this.mosaicCodes = res;
      if (this.person) {
        this.setMosaic();
      }
    });
  }

  ngOnChanges() {
    if (this.setperson) {
      if (this.person !== this.setperson) {
        this.person = this.setperson;
        if (this.mosaicCodes) {
          this.setMosaic();
        }
      }
    }
  }

  setMosaic() {
    // console.log(this.person.postcode);
    // this.referenceService.getCodefromPostCode(this.person.postcode).subscribe((mos: any) => {
    //   if (mos && mos.length > 0 && mos[0].mostype) {
    //     document.getElementById("mosaicTile").innerHTML = this.tiphtml(
    //       mos[0].mostype,
    //       this.mosaicCodes.find((x) => x.code === mos[0].mostype)
    //     );
    //   } else {
    document.getElementById("mosaicTile").innerHTML = "Unable to find Mosaic Type";
    //   }
    // });
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
    output += '<img alt="image" class="img-container" src="assets/images/mosaic/mosaic_' + usedMosaicType + '.jpg">';
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

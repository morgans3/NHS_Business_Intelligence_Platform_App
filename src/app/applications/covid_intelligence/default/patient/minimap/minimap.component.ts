import { Component, Input, OnChanges } from "@angular/core";
import { PatientLinked, Postcodes, APIService } from "diu-component-library";
import * as L from "leaflet";

@Component({
  selector: "app-minimap",
  templateUrl: "./minimap.component.html",
  styleUrls: ["./minimap.component.scss"],
})
export class MinimapComponent implements OnChanges {
  @Input() setperson: PatientLinked;
  person: PatientLinked;
  gpcode: string;
  postcode: string;
  map: any;

  constructor(
    private apiService: APIService, 
  ) {}

  ngOnChanges() {
    if (this.setperson) {
      if (this.person !== this.setperson) {
        this.person = this.setperson;
        this.gpcode = this.person.gpp_code;
        this.postcode = this.person.postcode;
        this.drawCompMap("map-leaflet-comp");
      }
    }
  }

  drawCompMap(chartName) {
    if (this.map !== undefined) {
      this.map.off();
      this.map.remove();
    }
    this.map = L.map(chartName).setView([53.967752, -2.444284], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    }).addTo(this.map);
    this.addMarkers();
  }

  addMarkers() {
    if (this.person.postcode) {
      this.setHomeMarker();
    }
    if (this.person.gpp_code) {
      this.setGPMarker();
    }
  }

  setHomeMarker() {
    this.apiService.getPostcodeData(this.person.postcode).subscribe((data: Postcodes) => {
      if (data.status === 200) {
        const homegroup = L.marker(
          {
            lat: data.result.latitude,
            lng: data.result.longitude,
          },
          {
            icon: new L.Icon(this.iconSettings("green")),
          }
        ).bindPopup(this.bindHomeHTML(), {
          closeButton: true,
          offset: L.point(0, -20),
        });
        homegroup.addTo(this.map);
      }
    });
  }

  bindHomeHTML() {
    let output = "<span>Home Address: ";
    this.person.address_line_1 ? (output += this.person.address_line_1 + ", ") : (output += "");
    this.person.address_line_2 ? (output += this.person.address_line_2 + ", ") : (output += "");
    this.person.address_line_3 ? (output += this.person.address_line_3 + ", ") : (output += "");
    this.person.address_line_4 ? (output += this.person.address_line_4 + ", ") : (output += "");
    if (this.person.address_line_5) output += this.person.address_line_5;
    output += "</span><br />";
    output += "<span>Post Code: " + this.person.postcode + "</span><br />";
    if (this.person.d_district) output += "<span>District: " + this.person.d_district + "</span><br />";
    if (this.person.d_local_authority_name) output += "<span>Local Authority: " + this.person.d_local_authority_name + "</span><br />";
    if (this.person.ward_name || this.person.d_ward_name) output += "<span>Electoral Ward: " + (this.person.ward_name || this.person.d_ward_name) + "</span><br />";
    return output;
  }

  setGPMarker() {
    this.apiService.getGPPractices().subscribe((data: any[]) => {
      if (data && data.length > 0) {
        const GPs = [];
        data[0].features.forEach((row) => {
          GPs.push({
            code: row.properties.Code,
            lat: row.properties.Lat,
            lng: row.properties.Long,
          });
        });
        const selectedGP = GPs.find((x) => x.Code === this.person.gpp_code);
        if (selectedGP) {
          const gpgroup = L.marker(
            {
              lat: selectedGP.lat,
              lng: selectedGP.lng,
            },
            {
              icon: new L.Icon(this.iconSettings("gold")),
            }
          ).bindPopup(this.bindGPHTML(), {
            closeButton: true,
            offset: L.point(0, -20),
          });
          gpgroup.addTo(this.map);
        }
      }
    });
  }

  bindGPHTML() {
    let output = "";
    if (this.person.practice || this.person.d_practice) output += "<span>Practice: " + (this.person.practice || this.person.d_practice) + "</span><br />";
    if (this.person.ccg) output += "<span>CCG: " + this.person.ccg + "</span><br />";
    if (this.person.pcn) output += "<span>PCN: " + this.person.pcn + "</span><br />";
    if (this.person.ics) output += "<span>ICS: " + this.person.ics + "</span><br />";
    return output;
  }

  iconSettings(color: string): L.BaseIconOptions {
    return {
      iconUrl: "assets/images/marker-icon-2x-" + color + ".png",
      shadowUrl: "assets/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    };
  }
}

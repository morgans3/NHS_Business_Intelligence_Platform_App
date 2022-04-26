import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-Global",
  templateUrl: "./Global.component.html",
  styleUrls: ["./Global.component.scss"]
})
export class GlobalComponent implements OnInit {
  global =
    "https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6";

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  sanitizeURL(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

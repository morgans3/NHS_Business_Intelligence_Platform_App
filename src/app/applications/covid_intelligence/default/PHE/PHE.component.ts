import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-PHE",
  templateUrl: "./PHE.component.html",
  styleUrls: ["./PHE.component.scss"],
})
export class PHEComponent implements OnInit {
  phe = "https://coronavirus.data.gov.uk/";

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  sanitizeURL(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

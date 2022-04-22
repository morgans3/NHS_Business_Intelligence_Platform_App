import { Component, OnInit, ViewChild } from "@angular/core";
import * as XLSX from "xlsx";
import { formatDate } from "@angular/common";
import { latLng, tileLayer } from "leaflet";
import * as L from "leaflet";
import { legendColors } from "./colorlist";
import { FormControl, FormGroup } from "@angular/forms";
import { NotificationService } from "src/app/_services/notification.service";
import { MapData } from "../../default/Incidents/IncidentForm/findlocation/findlocation.component";
import { iExcelWorkBook } from "src/app/_models/excel.interface";
import { iMappingDashboard } from "src/app/_models/mapping.interface";
import { Moment } from "moment-timezone";

@Component({
  selector: "app-mapping",
  templateUrl: "./mapping.component.html",
  styleUrls: ["./mapping.component.css"],
})
export class MappingComponent implements OnInit {
  arrayBuffer: any;
  file: File;
  workbook: iExcelWorkBook;
  sheet: any;
  @ViewChild("file_input_file", { static: false }) fileInput: HTMLInputElement;
  selectedSheet: string;
  mapHeight = { height: "50vh" };
  mapStyle = { display: "block" };
  mapRender = false;
  MapCenter = latLng(53.838759, -2.909497);
  MapZoom = 5;
  MapBounds: any;
  pinGroup: any;
  MapData: MapData = {
    options: {
      layers: [
        tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          minZoom: 8,
          attribution: "...",
        }),
      ],
      zoom: 9,
      center: latLng(53.838759, -2.909497),
    },
    layers: [],
  };
  mapLegend: any[] = [];
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  filtertext: string;
  selectedDashboard: iMappingDashboard = {
    name: "New Dashboard",
    author: null,
    lastUpdated: new Date(),
    datasets: [],
  };

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.range.valueChanges.subscribe(() => {
      let start = this.range.controls.start.value;
      if (start) start = <Moment>this.range.controls.start.value.toISOString();
      let end = this.range.controls.end.value;
      if (end) end = <Moment>this.range.controls.end.value.toISOString();
      this.selectedDashboard.range = { start: start, end: end };
    });
  }

  clearFile() {
    this.file = null;
    this.workbook = null;
  }

  incomingfile(event) {
    if (event.target.files[0]) {
      this.file = event.target.files[0];
      this.Upload();
    }
  }

  Upload() {
    this.workbook = { name: this.file.name, worksheets: [] };
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join("");
      const workbook = XLSX.read(bstr, { type: "binary" });
      workbook.SheetNames.forEach((sheet) => {
        const selectedSheet = workbook.Sheets[sheet];
        this.workbook.worksheets.push({
          name: sheet,
          data: XLSX.utils.sheet_to_json(selectedSheet, { raw: false }),
        });
      });
      if (this.workbook.worksheets.length === 1) {
        this.selectedSheet = "0";
        const mapData = this.workbook.worksheets[this.selectedSheet].data;
        if (mapData) this.drawMap(mapData);
      }
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  generateXLS() {
    if (this.workbook) {
      const newDate = new Date();
      const wb: XLSX.WorkBook = { SheetNames: [], Sheets: {} };
      this.workbook.worksheets.forEach((sheet) => {
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheet.data), sheet.name);
      });
      XLSX.writeFile(wb, "NexusIntelligence_Results_" + formatDate(newDate, "dd-MM-yyyy_HH_mm", "en-GB") + ".xlsx");
    }
  }

  drawMap(mapData: any[]) {
    this.MapData.layers = [];
    const newMarkers = new L.LayerGroup();
    this.mapLegend = [];
    mapData.forEach((element) => {
      const type = this.getIconType(element);
      let blnFoundLegend = false;
      this.mapLegend.forEach((item) => {
        if (item.displayName == type.displayName) {
          blnFoundLegend = true;
          item.total++;
        }
      });
      if (!blnFoundLegend) {
        this.mapLegend.push({ displayName: type.displayName, total: 1, marker: type.color });
      }
      L.marker(
        {
          lat: element.latitude || element.lat,
          lng: element.longitude || element.lng,
        },
        {
          icon: new L.Icon({
            iconUrl: "assets/images/marker-icon-2x-" + type.color + ".png",
            shadowUrl: "assets/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        }
      ).addTo(newMarkers);
    });
    this.MapData.layers.push(newMarkers);
  }

  getIconType(item) {
    if (item.type) {
      return { displayName: item.type, color: this.getColor(item.type) };
    }
    return { displayName: "Other", color: "red" };
  }

  getColor(type: string) {
    const previous = this.mapLegend.filter((x) => x.displayName === type);
    if (previous.length > 0) return previous[0].marker;
    const items = legendColors.filter((x) => x !== type);
    const item = items[Math.floor(Math.random() * items.length)];
    if (items.length === 0) return "red";
    return item;
  }

  applyFilter(value: string) {
    this.filtertext = value;
  }
}

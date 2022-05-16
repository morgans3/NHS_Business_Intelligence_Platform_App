import { Component, OnInit, ViewChild, ElementRef, EventEmitter, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

import * as d3 from "d3";
import * as L from "leaflet";
import "leaflet.markercluster";
import * as cloneLayer from "leaflet-clonelayer";
import { tileLayer, latLng } from "leaflet";
import * as betterWMS from "./L.TileLayer.BetterWMS.js";

import { DisplayType } from "../../../_models/displayType";
import { RootObject } from "../../../_models/GSI";
import { MapData } from "../../../shared/components/page-content/map/map.component";
import { MosaicCode, MosaicColorCodes } from "../../../_models/mosaiccode";
import { MosaicTable } from "../MosaicTable/MosaicTable.component";
import { CategoryBreakdown } from "../../../_models/categorybreakdown";
import { VariableDetails } from "../../../_models/variabledetails";
import { GIGraph } from "../GIGraph/GIGraph.component";
import { GIGraphKey } from "../mosaic-key/mosaic-key.component";
import { NotificationService } from "../../../../../_services/notification.service";
import { JoyrideService } from "ngx-joyride";
import { PoliceService } from "../../../_services/police.service";
import { CrimeCategoryColors } from "./colorlists";
import { Crime } from "../../../_models/police";
import { APIService, FeatureCollection } from "diu-component-library";

@Component({
  selector: "app-GSI",
  templateUrl: "./GSI.component.html",
  styleUrls: ["./GSI.component.scss"]
})
export class GSIComponent implements OnInit, OnDestroy {
  loadedCrimes: Crime[];
  syncToggle = false;
  mapOneWidth = 100;
  mapTwoWidth = 50;
  mapTwoStyle = { display: "none" };
  mapHeight = { height: "80vh" };
  currentmode = "default";
  @ViewChild("mapGraph") mapGraphDiv: ElementRef;
  @ViewChild("mapKeyGraph") mapKeyGraphDiv: ElementRef;
  mapTitle = "Mosaic Type";
  MapOneZoom = 10;
  MapTwoZoom = 10;
  MapOneCenter = latLng(53.838759, -2.909497);
  MapTwoCenter = latLng(53.838759, -2.909497);
  MapOneBounds: any;
  MapTwoBounds: any;
  pinGroupPrimary: any;
  pinGroupSecondary: any;
  MosaicMap: MapData = {
    options: {
      layers: [
        tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          minZoom: 8,
          attribution: "..."
        }) /*,
        betterWMS.betterWMS("http://localhost:8080/geoserver/ows?", {
          layers: "MosaicHousehold:mosaichousehold",
          format: "image/png",
          transparent: true,
          attribution: "Experian Mosaic"
        })

        */
        // tileLayer.wms("http://localhost:8080/geoserver/ows?", {
        //   layers: "MosaicHousehold:mosaichousehold",
        //   format: "image/png",
        //   transparent: true,
        //   attribution: "Experian Mosaic"
        // })
      ],
      zoom: 10,
      center: latLng(53.838759, -2.909497)
    },
    layers: []
  };
  mapTwoRender = false;
  MosaicMapTwo: MapData = {
    options: {
      layers: [
        tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          minZoom: 8,
          attribution: "..."
        })
      ],
      zoom: 10,
      center: latLng(53.838759, -2.909497)
    },
    layers: []
  };
  postCodePoly: any = {};
  HHTile: any = {};
  HHPoints: any = {};
  pinClicked: EventEmitter<any> = new EventEmitter();

  gsiData: RootObject;
  PC15: FeatureCollection;
  mosaicCodes: MosaicCode[];

  typesOfPolygons = [
    { name: "Mosaic", selectedPrimary: false, selectedSecondary: false },
    { name: "Property", selectedPrimary: false, selectedSecondary: false },
    { name: "Deprivation", selectedPrimary: false, selectedSecondary: false },
    { name: "CRDC Data", selectedPrimary: false, selectedSecondary: false }
  ];
  typesOfPoints = [
    { name: "Crimes", selectedPrimary: false, selectedSecondary: false },
    { name: "Property", selectedPrimary: false, selectedSecondary: false },
    { name: "Assets", selectedPrimary: false, selectedSecondary: false },
    { name: "NHS Sites", selectedPrimary: false, selectedSecondary: false },
    { name: "Food Outlets", selectedPrimary: false, selectedSecondary: false }
  ];
  CrimeCategories: { url: string; name: string }[];
  categories: string[];
  topics: string[];
  variables: string[];
  group: FormGroup = new FormGroup({
    category: new FormControl(),
    topic: new FormControl(),
    variable: new FormControl(),
    tooltip: new FormControl(),
    display: new FormControl("mosaic")
  });
  mosaicTypes: DisplayType[] = [
    { displayName: "Mosaic Types", value: "mosaic", disabled: false },
    { displayName: "Thematic Map", value: "thematic", disabled: true },
    { displayName: "Single Mosaic Type", value: "single", disabled: true }
  ];
  displayTypesPrimary: DisplayType[] = [];
  displayTypesSecondary: DisplayType[] = [];

  displayKey = false;
  giGraphKeySettings: GIGraphKey;
  showgiGraph = false;
  giGraphSettings: GIGraph;
  showgiTable = false;
  giTable: CategoryBreakdown[];
  selectedMosType = "";
  mosTypeTitle = "";

  constructor(
    private apiService: APIService,
    private notificationService: NotificationService,
    private readonly joyrideService: JoyrideService,
    private policeService: PoliceService
  ) {}

  ngOnInit() {
    this.pinClicked.subscribe(x => {
      this.MosaicClickEvent(x);
    });
    this.policeService
      .getCategories()
      .subscribe((res: { url: string; name: string }[]) => {
        this.CrimeCategories = res;
      });
  }

  ngOnDestroy() {
    this.pinClicked.unsubscribe();
  }

  applyPolygon(event) {
    let map = this.MosaicMap;
    if (event.target === "secondary") {
      map = this.MosaicMapTwo;
    }
    map.layers = []; // DON'T THIS WILL REMOVE PINS TOO
    if (event.target === "secondary") {
      this.displayTypesSecondary = [];
    } else {
      this.displayTypesPrimary = [];
    }
    switch (event.name) {
      case "Mosaic":
        if (event.value) {
          this.mosaicStartup(map);
          if (event.target === "secondary") {
            this.displayTypesSecondary = this.mosaicTypes;
          } else {
            this.displayTypesPrimary = this.mosaicTypes;
          }
        }
        break;
      default:
        // calculate layer
        // add layer to map
        break;
    }
  }

  applyPoints(event) {
    let map = this.MosaicMap;
    let bounds = this.MapOneBounds;
    if (event.target === "secondary") {
      map = this.MosaicMapTwo;
      bounds = this.MapTwoBounds;
      map.layers.splice(this.pinGroupSecondary, 1);
    } else {
      map.layers.splice(this.pinGroupPrimary, 1);
    }
    switch (event.name) {
      case "Crimes":
        if (event.value) {
          if (event.target === "secondary") {
            this.addCrimeMarkers(
              bounds,
              map,
              this.pinGroupSecondary,
              this.MapTwoZoom
            );
          } else {
            this.addCrimeMarkers(
              bounds,
              map,
              this.pinGroupPrimary,
              this.MapOneZoom
            );
          }
        }
        break;
      default:
        // calculate layer
        // add layer to map
        break;
    }
  }

  getPoints(name: string, map: string) {
    if (map === "primary") {
      return this.typesOfPoints.find(p => p.name === name).selectedPrimary;
    } else {
      return this.typesOfPoints.find(p => p.name === name).selectedSecondary;
    }
  }

  addCrimeMarkers(mapbounds, map, layer, zoom) {
    if (zoom < 14) {
      this.notificationService.warning(
        "Unable to obtain crimes at this level, please zoom in."
      );
    } else {
      if (!layer) {
        layer = new L.LayerGroup();
      }
      this.policeService.getWithinBoundary(mapbounds).subscribe((res: any) => {
        if (res.length > 0) {
          this.notificationService.info(
            `Displaying the ` +
              res.length +
              ` crimes retrieved from Police.gov.uk within the current map boundaries`
          );
          this.loadedCrimes = res;
          res.forEach(crime => {
            if (crime.location) {
              if (crime.location.latitude && crime.location.longitude) {
                const color = CrimeCategoryColors.find(
                  x => x.url === crime.category
                ) || { color: "grey" };
                L.marker(
                  {
                    lat: crime.location.latitude,
                    lng: crime.location.longitude
                  },
                  {
                    icon: new L.Icon({
                      iconUrl:
                        "assets/images/marker-icon-2x-" + color.color + ".png",
                      shadowUrl: "assets/images/marker-shadow.png",
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                      shadowSize: [41, 41]
                    })
                  }
                )
                  .bindPopup(this.crimePopup(crime))
                  .addTo(layer);
              }
            }
          });
          map.layers.push(layer);
        } else {
          this.notificationService
            .info(`No crimes found within the bounds of the current map.
            If you wish to find crimes either re-center the map or draw a specific area.`);
        }
      });
    }
  }

  crimePopup(crime) {
    let response =
      `<strong>` +
      this.CrimeCategories.find(x => x.url === crime.category).name +
      `</strong><p>Date: ` +
      crime.month +
      `</p>`;
    if (crime.outcome_status && crime.outcome_status.category) {
      response += `<p>Outcome: ` + crime.outcome_status.category + `</p>`;
    }
    return response;
  }

  updateCrimeLayer(newLayer) {
    console.log(newLayer);
    // check which map police pins are on
    // replace that pin layer with newLayer
  }

  changeMap(mode: string) {
    this.mapHeight = { height: "80vh" };
    this.currentmode = mode;
    switch (mode) {
      case "vertical":
        this.mapOneWidth = 50;
        this.mapTwoWidth = 50;
        this.mapTwoStyle = { display: "block" };
        this.mapTwoRender = !this.mapTwoRender;
        break;
      case "horizontal":
        this.mapOneWidth = 100;
        this.mapTwoWidth = 100;
        this.mapTwoStyle = { display: "block" };
        this.mapTwoRender = !this.mapTwoRender;
        this.mapHeight = { height: "40vh" };
        break;
      default:
        this.mapOneWidth = 100;
        this.mapTwoWidth = 50;
        this.mapTwoStyle = { display: "none" };
        break;
    }
  }
  pickMode(mode: string) {
    if (mode === "sync") {
      return this.syncToggle ? "primary" : "default";
    }
    if (mode === this.currentmode) {
      return "primary";
    }
    return "default";
  }
  copyLayers(source: string) {
    if (source === "primary") {
      this.pushIntoArray(this.MosaicMap, this.MosaicMapTwo);
    } else {
      this.pushIntoArray(this.MosaicMapTwo, this.MosaicMap);
    }
  }
  pushIntoArray(primary, secondary) {
    secondary.layers = [];
    primary.layers.forEach(element => {
      const cloneOfLayer = cloneLayer(element);
      if (element._tooltip) {
        cloneOfLayer._tooltip = element._tooltip;
      }
      if (element._tooltipHandlersAdded) {
        cloneOfLayer._tooltipHandlersAdded = element._tooltipHandlersAdded;
      }
      if (element._events) {
        cloneOfLayer._events = element._events;
      }
      secondary.layers.push(cloneOfLayer);
    });
  }
  checkTab(tabname) {
    if (this.typesOfPolygons.find(x => x.name === tabname)) {
      return (
        this.typesOfPolygons.find(x => x.name === tabname).selectedPrimary ||
        this.typesOfPolygons.find(x => x.name === tabname).selectedSecondary
      );
    } else if (this.typesOfPoints.find(x => x.name === tabname)) {
      return (
        this.typesOfPoints.find(x => x.name === tabname).selectedPrimary ||
        this.typesOfPoints.find(x => x.name === tabname).selectedSecondary
      );
    } else {
      return false;
    }
  }

  showGuide() {
    this.joyrideService.startTour({
      steps: ["gsi1", "gsi2", "gsi3"]
    });
  }

  /**
   *
   * Mosaic Map Functions
   *
   */
  mosaicStartup(map) {
    if (!this.mosaicCodes) {
      this.apiService.getMosiacs().subscribe((res: MosaicCode[]) => {
        this.mosaicCodes = res;
      });
    }
    if (!this.gsiData) {
      this.apiService.getGrandIndex().subscribe((res: any) => {
        if (res) {
          this.gsiData = res[0].concat;
          this.resetSelected();
        }
      });
    }
    if (!this.PC15) {
      this.apiService.getAllPostcodes().subscribe((res: FeatureCollection[]) => {
        if (res.length > 0) {
          this.PC15 = res[0];
          this.initMosaicView(map);
        } else {
          this.notificationService.error("Unable to retrieve Geo-Spatial Data");
        }
      });
    } else {
      this.initMosaicView(map);
    }
  }
  initMosaicView(map) {
    this.group.patchValue({ display: "mosaic" });
    this.displayKey = false;
    this.showgiGraph = false;
    this.showgiTable = false;

    this.postCodePoly = new L.GeoJSON(this.PC15, {
      style: this.stylePostcodeType
    })
      .bindTooltip(layer => {
        const mosaic: MosaicCode = this.mosaicCodes.find(
          x => x.code === layer["feature"].properties.f1
        );
        return this.htmlMosaicTooltip(layer["feature"].properties.f1, mosaic);
      })
      .on("click", e => {
        this.pinClicked.emit(e["sourceTarget"].feature.properties.f1);
        window.dispatchEvent(new Event("resize"));
      });

    this.HHTile = new betterWMS.betterWMS(
      "http://nexusintelligence.xfyldecoast.nhs.uk:8600/geoserver/ows?",
      {
        layers: "MosaicHousehold:mosaichousehold",
        format: "image/png",
        transparent: true,
        attribution: "Experian Mosaic"
      }
    );

    map.layers = [];
    map.layers.push(this.postCodePoly);
  }
  MosaicClickEvent(mosType) {
    this.initSingleView(mosType);
    this.changeMapTitle(
      mosType + ": " + this.mosaicCodes.find(x => x.code === mosType).name
    );

    this.displayKey = false;
    this.displayTypesPrimary[
      this.displayTypesPrimary.findIndex(x => x.value === "thematic")
    ].disabled = true;

    // this.revertBarsToNormal();
    this.resetSelected();
  }

  /**
   *
   * Thematic Map Functions
   *
   */
  initThematicView(map) {
    this.displayKey = true;
    this.showgiGraph = false;
    this.showgiTable = false;
    this.displayTypesPrimary[
      this.displayTypesPrimary.findIndex(x => x.value === "thematic")
    ].disabled = false;
    this.group.patchValue({ display: "thematic" });
    this.displayTypesPrimary[
      this.displayTypesPrimary.findIndex(x => x.value === "single")
    ].disabled = true;
    this.mapTitle =
      "Thematic Map: " +
      this.group.value["category"] +
      " ⇛ " +
      this.group.value["topic"] +
      " ⇛ " +
      this.group.value["variable"];

    map.layers = [];

    const MosaicTypeLookupValAndRange = {};
    const MosaicTypeLookup = this.gsiData[this.group.value["category"]][
      this.group.value["topic"]
    ][this.group.value["variable"]];

    for (const key1 in MosaicTypeLookup) {
      if (!MosaicTypeLookup.hasOwnProperty(key1)) {
        continue;
      }
      const obj = MosaicTypeLookup[key1];
      for (const prop in obj) {
        if (!obj.hasOwnProperty(prop)) {
          continue;
        }
      }
    }

    const variableRange = [Infinity, -Infinity];
    for (const key2 in MosaicTypeLookup) {
      if (!MosaicTypeLookup.hasOwnProperty(key2)) {
        continue;
      }

      if (MosaicTypeLookup[key2] > variableRange[1]) {
        variableRange[1] = MosaicTypeLookup[key2];
      }
      if (MosaicTypeLookup[key2] < variableRange[0]) {
        variableRange[0] = MosaicTypeLookup[key2];
      }
    }

    for (const key3 in MosaicTypeLookup) {
      if (!MosaicTypeLookup.hasOwnProperty(key3)) {
        continue;
      }
      MosaicTypeLookupValAndRange[key3] = [
        MosaicTypeLookup[key3],
        (MosaicTypeLookup[key3] - variableRange[0]) /
          (variableRange[1] - variableRange[0])
      ];
    }

    for (const key4 in this.postCodePoly._layers) {
      if (!this.postCodePoly._layers.hasOwnProperty(key4)) {
        continue;
      }
      this.postCodePoly._layers[key4].feature.properties.themeVal =
        MosaicTypeLookupValAndRange[
          this.postCodePoly._layers[key4].feature.properties.f1
        ];
    }

    this.postCodePoly.setStyle(e => {
      return this.stylePostcodeThematic(e);
    });

    map.layers = [];
    map.layers.push(this.postCodePoly);

    this.displayKey = true;
    this.giGraphKeySettings = {
      name: "Name",
      variableRange: variableRange,
      MosaicTypeLookup: MosaicTypeLookup,
      MosaicTypeLookupValAndRange: MosaicTypeLookupValAndRange
    };
  }

  /**
   *
   * Single Selected Mosaic Map Functions
   *
   */
  initSingleView(mosType: any) {
    this.postCodePoly.setStyle(e => {
      return this.styleHighlightType(
        e,
        mosType,
        MosaicColorCodes.find(x => x.code === mosType.substring(0, 1)).color
      );
    });

    this.displayTypesPrimary[
      this.displayTypesPrimary.findIndex(x => x.value === "single")
    ].disabled = false;
    this.group.patchValue({ display: "single" });
    this.group.updateValueAndValidity();
    this.updateMosaicTypeInfo(mosType);

    const cat = this.group.value["category"];
    const topic = this.group.value["topic"];

    if (cat && topic) {
      this.showgiGraph = true;
      this.giGraphSettings = {
        name: this.mosaicCodes.find(x => x.code === mosType).name,
        category: cat,
        topic: topic,
        mosType: mosType,
        width: this.mapGraphDiv.nativeElement.clientWidth
      };
    } else {
      this.showgiGraph = false;
    }
    this.displayKey = false;
  }
  updateMosaicTypeInfo(mosType: any) {
    this.showgiTable = true;
    this.giTable = [];

    this.selectedMosType = mosType;
    this.mosTypeTitle = this.mosaicCodes.find(x => x.code === mosType).name;

    // tslint:disable-next-line: forin
    for (const cat in this.gsiData) {
      const categoryTable: CategoryBreakdown = { cat: "", tables: null };

      if (!this.gsiData.hasOwnProperty(cat)) {
        continue;
      }
      const thisTop = this.gsiData[cat];
      categoryTable.cat = cat;
      categoryTable.tables = [];
      // tslint:disable-next-line: forin
      for (const topic in thisTop) {
        const outputHtml: MosaicTable = { title: "", data: null };
        if (!thisTop.hasOwnProperty(topic)) {
          continue;
        }
        const letb = thisTop[topic];
        outputHtml.title = topic;
        const variableValues: VariableDetails[] = [];
        for (const leti in letb) {
          if (!letb.hasOwnProperty(leti)) {
            continue;
          }
          const thisvariable = letb[leti];
          const variableAverage = this.average(Object.values(letb[leti]));
          const thisCodeValue = thisvariable[mosType];
          const obsOverExpected = (thisCodeValue / variableAverage) * 100.0;
          const thisDetail: VariableDetails = {
            Type: leti,
            Value: Math.round(thisCodeValue * 10.0) / 10.0,
            Ratio: Math.round(obsOverExpected)
          };
          variableValues.push(thisDetail);
        }
        outputHtml.data = variableValues;
        categoryTable.tables.push(outputHtml);
      }
      this.giTable.push(categoryTable);
    }
  }
  average(data) {
    const sum = data.reduce(function(sm, value) {
      return sm + value;
    }, 0);
    return sum / data.length;
  }

  /**
   *
   * Filter Change Functions
   *
   */
  resetSelected() {
    this.categories = Object.keys(this.gsiData);
    this.topics = [];
    this.variables = [];
    this.displayKey = false;
  }
  changeCat(value: any) {
    this.topics = Object.keys(this.gsiData[value]);
    this.variables = [];
    this.displayKey = false;
    this.thematicSelection(false);
  }
  changeTopic(value: any) {
    this.variables = Object.keys(
      this.gsiData[this.group.value["category"]][value]
    );
    this.displayKey = false;
    this.thematicSelection(false);

    const cat = this.group.value["category"];
    const topic = this.group.value["topic"];
    if (cat && topic && this.selectedMosType) {
      this.showgiGraph = true;
      this.giGraphSettings = {
        name: this.mosaicCodes.find(x => x.code === this.selectedMosType).name,
        category: cat,
        topic: topic,
        mosType: this.selectedMosType,
        width: this.mapGraphDiv.nativeElement.clientWidth
      };
    }
  }
  thematicSelection(enabled: boolean) {
    const option = this.displayTypesPrimary.find(x => x.value === "thematic");
    option.disabled = !enabled;
    if (!enabled) {
      if (this.group.value["display"] === "thematic") {
        this.group.patchValue({ display: "mosiac" });
        if (
          this.typesOfPolygons.find(x => x.name === "Mosaic").selectedPrimary
        ) {
          this.initMosaicView(this.MosaicMap);
        } else if (
          this.typesOfPolygons.find(x => x.name === "Mosaic").selectedSecondary
        ) {
          this.initMosaicView(this.MosaicMapTwo);
        }
      }
    }
  }
  changeVariable(value: any) {
    if (this.typesOfPolygons.find(x => x.name === "Mosaic").selectedPrimary) {
      this.initThematicView(this.MosaicMap);
    } else if (
      this.typesOfPolygons.find(x => x.name === "Mosaic").selectedSecondary
    ) {
      this.initThematicView(this.MosaicMapTwo);
    }
  }
  changeType(value: any) {
    let map = null;
    if (this.typesOfPolygons.find(x => x.name === "Mosaic").selectedPrimary) {
      map = this.MosaicMap;
    } else if (
      this.typesOfPolygons.find(x => x.name === "Mosaic").selectedSecondary
    ) {
      map = this.MosaicMapTwo;
    }
    if (map) {
      switch (value) {
        case "mosaic":
          this.initMosaicView(map);
          break;
        case "single":
          if (this.selectedMosType) {
            this.initSingleView(this.selectedMosType);
          }
          break;
        case "thematic":
          const variable = this.group.value["variable"];
          if (variable) {
            this.initThematicView(map);
          }
          break;
        default:
          break;
      }
    }
  }
  changeMapTitle(title: string) {
    this.mapTitle = title;
  }

  /**
   *
   * Map Navigation Functions
   *
   */

  toggleSync() {
    this.MapTwoCenter = this.MapOneCenter;
    setTimeout(() => {
      this.MapTwoZoom = this.MapOneZoom;
    }, 200);
    setTimeout(() => {
      this.syncToggle = !this.syncToggle;
    }, 500);
  }
  syncMap(type, target) {
    if (target === "primary") {
      if (type === "zoom") {
        this.MapOneZoom = this.MapTwoZoom;
      } else {
        setTimeout(() => {
          this.setCenter("secondary");
        }, 250);
      }
    } else {
      if (type === "zoom") {
        this.MapTwoZoom = this.MapOneZoom;
      } else {
        setTimeout(() => {
          this.setCenter("primary");
        }, 250);
      }
    }
  }
  zoomChange(newLevel, source) {
    let map = this.MosaicMap;
    if (source === "primary") {
      this.MapOneZoom = newLevel.zoom;
      this.MapOneBounds = newLevel.bounds;
      if (this.syncToggle) {
        this.syncMap("zoom", "secondary");
      }
    } else {
      map = this.MosaicMapTwo;
      this.MapTwoZoom = newLevel.zoom;
      this.MapTwoBounds = newLevel.bounds;
      if (this.syncToggle) {
        this.syncMap("zoom", "primary");
      }
    }
    if (newLevel.zoom >= 17) {
      const indexOfPC = map.layers.findIndex(x => x === this.postCodePoly);

      if (indexOfPC > -1) {
        map.layers.splice(indexOfPC, 1);
      }

      if (!map.layers.find(x => x === this.HHTile)) {
        map.layers.push(this.HHTile);
      }
    } else {
      if (!map.layers.find(x => x === this.postCodePoly)) {
        map.layers.push(this.postCodePoly);
      }

      const indexOfHH = map.layers.findIndex(x => x === this.HHTile);

      if (indexOfHH > -1) {
        map.layers.splice(indexOfHH, 1);
      }
    }
  }
  setToHighest() {
    if (this.MapOneZoom < this.MapTwoZoom) {
      this.MapTwoZoom = this.MapOneZoom;
    } else {
      this.MapOneZoom = this.MapTwoZoom;
    }
  }
  setToLowest() {
    if (this.MapOneZoom > this.MapTwoZoom) {
      this.MapTwoZoom = this.MapOneZoom;
    } else {
      this.MapOneZoom = this.MapTwoZoom;
    }
  }
  setCenter(source) {
    if (source === "primary") {
      this.MapTwoCenter = this.MapOneCenter;
    } else {
      this.MapOneCenter = this.MapTwoCenter;
    }
  }
  centerChange(newLevel, source) {
    if (source === "primary") {
      this.MapOneCenter = newLevel.center;
      this.MapOneBounds = newLevel.bounds;
      if (this.syncToggle) {
        this.syncMap("center", "secondary");
      }
    } else {
      this.MapTwoCenter = newLevel.center;
      this.MapTwoBounds = newLevel.bounds;
      if (this.syncToggle) {
        this.syncMap("center", "primary");
      }
    }
  }

  /**
   *
   * Styling Data Functions
   *
   */
  stylePostcodeThematic(feature) {
    let sclScale = 0;
    if (feature.properties.f1 !== "U99") {
      sclScale = feature.properties.themeVal[1];
    }

    return {
      fillColor: this.thematicColour(sclScale),
      weight: 0.25,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.5
    };
  }
  thematicColour(sclScale) {
    const color = d3
      .scaleLinear<string>()
      .domain([0, 0.5, 1])
      .range(["#ffff00", "#31c831", "#003366"])
      .interpolate(d3.interpolateHclLong);
    return color(sclScale);
  }
  stylePostcodeType(feature) {
    let color = "#FFFFFF";
    color = MosaicColorCodes.find(
      x => x.code === feature.properties.f1.substring(0, 1)
    ).color;
    return {
      fillColor: color,
      weight: 0.25,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.5
    };
  }
  styleHighlightType(feature, mosType, colour) {
    let opac = 0.0;
    if (feature.properties.f1 === mosType) {
      opac = 0.75;
    }
    return {
      fillColor: colour,
      weight: 0.25,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: opac
    };
  }
  styleHousehold(feature) {
    let color = "#FFFFFF";
    color = MosaicColorCodes.find(
      x => x.code === feature["properties"].MosaicGroup.substring(0, 1)
    ).color;
    return {
      fillColor: color,
      radius: 4,
      weight: 0,
      opacity: 1,
      fillOpacity: 0.8
    };
  }
  public htmlMosaicTooltip(d, mosaic) {
    const usedMosaicType = d;
    let output = "";
    output =
      "	<div id='mosaicToolTip' class='container d3-tip mosaic-" +
      usedMosaicType.substr(0, 1) +
      "'>";
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
    output +=
      '<img alt="image" class="img-container" src="assets/images/mosaic/mosaic_' +
      usedMosaicType +
      '.jpg">';
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

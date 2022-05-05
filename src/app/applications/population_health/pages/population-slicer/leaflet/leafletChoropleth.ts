// import * as dc from "dc";
// import * as d3 from "d3";
// import * as L from "leaflet";

// export interface BaseChart extends dc.BaseMixin<BaseChart> {}
// export interface ColorChart extends dc.ColorMixin<ColorChart>, dc.BaseMixin<ColorChart> {}
// export interface LeafletChart extends ColorChart {
//   featureOptions(_?: any): any;
//   featureStyle(_?: any): any;
//   featureKeyAccessor(_?: any): any;
//   _postRender(): any;
//   geojson(_?: any): any;
//   map(): any;
//   doRedraw(): any;
//   popup(_?: any): any;
//   renderPopup(_?: any): any;
//   computeOrderedGroups(): any;
//   brushOn(_?: any): any;
//   info(): any;
// }

// export function ColorChart(_chart) {
//   let _colors = d3.scaleOrdinal(d3.schemeCategory10);
//   let _colorDomain: any = [0, _colors.range().length];
//   let _colorCalculator = function(value) {
//     let domain = _colorDomain;
//     if (typeof _colorDomain === "function") {
//       domain = _colorDomain.call(_chart);
//     }
//     const minValue = domain[0];
//     const maxValue = domain[1];

//     if (isNaN(value)) {
//       value = 0;
//     }
//     if (!dc.utils.isNumber(maxValue)) {
//       return _colors(value);
//     }

//     const colorsLength = _chart.colors().range().length;
//     const denominator = (maxValue - minValue) / colorsLength;
//     const colorValue = Math.abs(Math.min(colorsLength - 1, Math.round((value - minValue) / denominator)));
//     return _chart.colors()(colorValue);
//   };

//   let _colorAccessor = function(d, i) {
//     return i;
//   };
//   _chart.colors = function(_) {
//     if (!arguments.length) {
//       return _colors;
//     }

//     if (_ instanceof Array) {
//       const domain = [];
//       for (let i = 0; i < _.length; ++i) {
//         domain.push(i);
//       }
//       const newcolors: d3.ScaleOrdinal<string, string> = d3.scaleOrdinal();
//       _colors = newcolors.range(_).domain(domain);
//     } else {
//       _colors = _;
//     }
//     _colorDomain = [0, _colors.range().length];
//     return _chart;
//   };

//   _chart.colorCalculator = function(_) {
//     if (!arguments.length) {
//       return _colorCalculator;
//     }
//     _colorCalculator = _;
//     return _chart;
//   };

//   _chart.getColor = function(d, i) {
//     return _colorCalculator(_colorAccessor(d, i));
//   };

//   _chart.colorAccessor = function(_) {
//     if (!arguments.length) {
//       return _colorAccessor;
//     }
//     _colorAccessor = _;
//     return _chart;
//   };

//   _chart.colorDomain = function(_) {
//     if (!arguments.length) {
//       return _colorDomain;
//     }
//     _colorDomain = _;
//     return _chart;
//   };

//   return _chart;
// }

// export function LeafletChart(_chart) {
//   _chart = dc.baseLeafletChart(_chart);

//   let _map;

//   let _mapOptions: any = false;
//   let _defaultCenter = false;
//   let _defaultZoom = false;

//   let _tiles = function(map) {
//     L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
//       attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//     }).addTo(map);
//   };

//   _chart.doRender = function() {
//     _map = L.map(_chart.root().node(), _mapOptions);
//     if (_defaultCenter && _defaultZoom) {
//       _map.setView(_chart.toLocArray(_defaultCenter), _defaultZoom);
//     }

//     _chart.tiles()(_map);

//     _chart._postRender();

//     return _chart.doRedraw();
//   };

//   _chart._postRender = function() {
//     //abstract
//   };

//   _chart.mapOptions = function(_) {
//     if (!arguments.length) {
//       return _mapOptions;
//     }
//     _mapOptions = _;
//     return _chart;
//   };

//   _chart.center = function(_) {
//     if (!arguments.length) {
//       return _defaultCenter;
//     }
//     _defaultCenter = _;
//     return _chart;
//   };

//   _chart.zoom = function(_) {
//     if (!arguments.length) {
//       return _defaultZoom;
//     }
//     _defaultZoom = _;
//     return _chart;
//   };

//   _chart.tiles = function(_) {
//     if (!arguments.length) {
//       return _tiles;
//     }
//     _tiles = _;
//     return _chart;
//   };

//   _chart.map = function() {
//     return _map;
//   };

//   _chart.toLocArray = function(value) {
//     if (typeof value == "string") {
//       // expects '11.111,1.111'
//       value = value.split(",");
//     }
//     // else expects [11.111,1.111]
//     return value;
//   };

//   return _chart;
// }

// export function leafletChoroplethChart(parent, chartGroup?) {
//   const _chart = LeafletChart({});

//   let _geojsonLayer: any = false;
//   let _dataMap = [];

//   let _geojson = false;
//   let _renderPopup = true;
//   let _brushOn = true;
//   let _featureOptions = {
//     fillColor: "black",
//     color: "gray",
//     opacity: 0.4,
//     fillOpacity: 0.6,
//     weight: 1
//   };
//   const _renderTitle = true;
//   let _featureKey = function(feature) {
//     return feature.key;
//   };

//   let _featureStyle = function(feature) {
//     let options = _chart.featureOptions();
//     if (options instanceof Function) {
//       options = options(feature);
//     }
//     options = JSON.parse(JSON.stringify(options));
//     const v = _dataMap[_chart.featureKeyAccessor()(feature)];
//     if (v && v.d) {
//       options.fillColor = _chart.getColor(v.d, v.i);
//       if (_chart.filters().indexOf(v.d.key) !== -1) {
//         options.opacity = 0.8;
//         options.color = "#725848";
//         options.weight = 2.5;
//       }
//     }
//     return options;
//   };

//   let _popup = function(d, feature) {
//     return _chart.title()(d);
//   };

//   _chart._postRender = function() {
//     _geojsonLayer = L.geoJSON(_chart.geojson(), {
//       style: _chart.featureStyle(),
//       onEachFeature: processFeatures
//     });
//     _chart.map().addLayer(_geojsonLayer);
//   };

//   _chart.doRedraw = function() {
//     _geojsonLayer.clearLayers();
//     _dataMap = [];
//     _chart.computeOrderedGroups().forEach(function(d, i) {
//       _dataMap[_chart.keyAccessor()(d)] = {
//         d: d,
//         i: i
//       };
//     });
//     _geojsonLayer.addData(_chart.geojson());

//     _chart.legend().render();
//   };

//   _chart.geojson = function(_) {
//     if (!arguments.length) {
//       return _geojson;
//     }
//     _geojson = _;
//     return _chart;
//   };

//   _chart.featureOptions = function(_) {
//     if (!arguments.length) {
//       return _featureOptions;
//     }
//     _featureOptions = _;
//     return _chart;
//   };

//   _chart.featureKeyAccessor = function(_) {
//     if (!arguments.length) {
//       return _featureKey;
//     }
//     _featureKey = _;
//     return _chart;
//   };

//   _chart.featureStyle = function(_) {
//     if (!arguments.length) {
//       return _featureStyle;
//     }
//     _featureStyle = _;
//     return _chart;
//   };

//   _chart.popup = function(_) {
//     if (!arguments.length) {
//       return _popup;
//     }
//     _popup = _;
//     return _chart;
//   };

//   _chart.renderPopup = function(_) {
//     if (!arguments.length) {
//       return _renderPopup;
//     }
//     _renderPopup = _;
//     return _chart;
//   };

//   _chart.brushOn = function(_) {
//     if (!arguments.length) {
//       return _brushOn;
//     }
//     _brushOn = _;
//     return _chart;
//   };

//   const processFeatures = function(feature, layer) {
//     const v = _dataMap[_chart.featureKeyAccessor()(feature)];
//     if (v && v.d) {
//       layer.key = v.d.key;
//       if (_chart.renderPopup()) {
//         layer.bindPopup(_chart.popup()(v.d, feature));
//       }

//       //Define mouse events
//       layer.on({
//         mouseover: function(e) {
//           //gis.stackexchange.com/questions/31951/how-to-show-a-popup-on-mouse-over-not-on-click
//           //this.openPopup(); //built-in leaflet popup window

//           //Custom Control with Leaflet
//           //http://leafletjs.com/examples/choropleth.html
//           //highlight region borders
//           const layer = e.target;

//           layer.setStyle({
//             weight: 3,
//             color: "#422703"
//             //dashArray: '',
//             //fillOpacity: 0.7 //changes colour upon hover
//           });

//           if (!L.Browser.ie && !L.Browser.opera12) {
//             layer.bringToFront();
//           }

//           //apply border highlight
//           _chart.info().update(v.d);
//         },

//         //reset borders on mouseout
//         mouseout: function(e) {
//           _geojsonLayer.resetStyle(e.target);
//         }
//       });

//       if (_chart.brushOn()) {
//         layer.on("click", selectFilter);
//       }
//     }
//   };

//   const selectFilter = function(e) {
//     if (!e.target) {
//       return;
//     }
//     const filter = e.target.key;
//     dc.events.trigger(function() {
//       _chart.filter(filter);
//       dc.redrawAll(_chart.chartGroup());
//     });
//   };

//   return _chart.anchor(parent, chartGroup);
// }

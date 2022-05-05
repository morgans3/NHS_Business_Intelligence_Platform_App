// import * as dc from "dc";
// import * as L from "leaflet";

// export function leafletBubble(parent, chartGroup) {
//   const _chart: any = dc.baseLeafletChart(parent, chartGroup);
//   let _cluster = false; // requires leaflet.circleCluster
//   let _clusterOptions = false;
//   let _rebuildcircles = false;
//   let _brushOn = true;
//   let _filterByArea = false;
//   let _innerFilter = false;
//   let _zooming = false;
//   const _layerGroup: any = false;
//   let _circleList = {};
//   let _fitOnRender = true;
//   let _fitOnRedraw = false;
//   let _disableFitOnRedraw = false;
//   let _renderPopup = true;
//   let _popupOnHover = true;
//   let _circleScale = 30;

//   _chart.renderTitle(true);

//   let _location = function(d) {
//     return _chart.keyAccessor()(d);
//   };

//   _chart.circleScale = function(_) {
//     if (!arguments.length) {
//       return _circleScale;
//     }
//     _circleScale = _;
//     return _chart;
//   };

//   let _circle = function(d) {
//     const value: L.LatLngExpression = _chart.toLocArray(_chart.locationAccessor()(d));
//     const options = {
//       sizeValue: d.value,
//       scaleFactor: _circleScale,
//       radius: Math.sqrt((d.value * _circleScale) / Math.PI),
//       clickable: _chart.renderPopup() || (_chart.brushOn() && !_filterByArea),
//       color: "#4D75BA",
//       fillColor: "#E03F8B",
//       fillOpacity: 0.8,
//       weight: 1,
//       draggable: false
//     };
//     const circle = L.circle(value, options);
//     return circle;
//   };

//   let _icon = function(d, map) {
//     return new L.Icon.Default();
//   };

//   let _popup = function(d, circle) {
//     return _chart.title()(d);
//   };

//   _chart._postRender = function() {
//     if (_chart.brushOn()) {
//       if (_filterByArea) {
//         _chart.filterHandler(doFilterByArea);
//       }

//       _chart.map().on("zoomend moveend", zoomFilter, this);
//       if (!_filterByArea) {
//         _chart.map().on("click", zoomFilter, this);
//       }
//       _chart.map().on("zoomstart", zoomStart, this);
//     }

//     // if (_cluster) {
//     //   _layerGroup = new L.circleClusterGroup(_clusterOptions ? _clusterOptions : null);
//     // } else {
//     //   _layerGroup = new L.LayerGroup();
//     // }
//     _chart.map().addLayer(_layerGroup);
//   };

//   _chart._doRedraw = function() {
//     const groups = _chart._computeOrderedGroups(_chart.data()).filter(function(d) {
//       return _chart.valueAccessor()(d) !== 0;
//     });

//     if (_rebuildcircles) {
//       _circleList = {};
//     }
//     _layerGroup.clearLayers();

//     const addList = [];
//     groups.forEach(function(v, i) {
//       const key = _chart.keyAccessor()(v);
//       let circle = null;
//       if (!_rebuildcircles && key in _circleList) {
//         circle = _circleList[key];
//       } else {
//         circle = createcircle(v, key);
//       }

//       const curFilters = _chart.filters();
//       let circleOpacity = curFilters.length ? 0.1 : 0.8;
//       curFilters.forEach(function(filter) {
//         if (key === filter) {
//           circleOpacity = 0.8;
//         }
//       });

//       circle.options.scaleFactor = _circleScale;
//       circle.setStyle({ fillOpacity: circleOpacity });
//       circle.setRadius(Math.sqrt((v.value * _circleScale) / Math.PI));

//       if (!_chart.cluster()) {
//         _layerGroup.addLayer(circle);
//       } else {
//         addList.push(circle);
//       }
//     });

//     if (_chart.cluster() && addList.length > 0) {
//       _layerGroup.addLayers(addList);
//     }

//     if (addList.length > 0) {
//       if (_fitOnRender || (_fitOnRedraw && !_disableFitOnRedraw)) {
//         const featureGroup = L.featureGroup(addList);
//         _chart.map().fitBounds(featureGroup.getBounds()); //.pad(0.5));
//       }
//     }

//     _disableFitOnRedraw = false;
//     _fitOnRender = false;
//   };

//   _chart.locationAccessor = function(_) {
//     if (!arguments.length) {
//       return _location;
//     }
//     _location = _;
//     return _chart;
//   };

//   _chart.circle = function(_) {
//     if (!arguments.length) {
//       return _circle;
//     }
//     _circle = _;
//     return _chart;
//   };

//   _chart.icon = function(_) {
//     if (!arguments.length) {
//       return _icon;
//     }
//     _icon = _;
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

//   _chart.popupOnHover = function(_) {
//     if (!arguments.length) {
//       return _popupOnHover;
//     }
//     _popupOnHover = _;
//     return _chart;
//   };

//   _chart.cluster = function(_) {
//     if (!arguments.length) {
//       return _cluster;
//     }
//     _cluster = _;
//     return _chart;
//   };

//   _chart.clusterOptions = function(_) {
//     if (!arguments.length) {
//       return _clusterOptions;
//     }
//     _clusterOptions = _;
//     return _chart;
//   };

//   _chart.rebuildcircles = function(_) {
//     if (!arguments.length) {
//       return _rebuildcircles;
//     }
//     _rebuildcircles = _;
//     return _chart;
//   };

//   _chart.brushOn = function(_) {
//     if (!arguments.length) {
//       return _brushOn;
//     }
//     _brushOn = _;
//     return _chart;
//   };

//   _chart.filterByArea = function(_) {
//     if (!arguments.length) {
//       return _filterByArea;
//     }
//     _filterByArea = _;
//     return _chart;
//   };

//   _chart.fitOnRender = function(_) {
//     if (!arguments.length) {
//       return _fitOnRender;
//     }

//     _fitOnRender = _;
//     return _chart;
//   };

//   _chart.fitOnRedraw = function(_) {
//     if (!arguments.length) {
//       return _fitOnRedraw;
//     }

//     _fitOnRedraw = _;
//     return _chart;
//   };

//   _chart.circleGroup = function() {
//     return _layerGroup;
//   };

//   const createcircle = function(v, k) {
//     const circle = _circle(v);
//     circle.feature.properties.key = k;
//     if (_chart.renderPopup()) {
//       circle.bindPopup(_chart.popup()(v, circle));

//       if (_chart.popupOnHover()) {
//         circle.on("mouseover", function() {
//           circle.openPopup();
//         });

//         circle.on("mouseout", function() {
//           circle.closePopup();
//         });
//       }
//     }

//     const selectFilter = function(e) {
//       if (!e.target) {
//         return;
//       }

//       _disableFitOnRedraw = true;
//       const filter = e.target.key;
//       dc.events.trigger(function() {
//         _chart.filter(filter);
//         dc.redrawAll(_chart.chartGroup());
//       });
//     };

//     if (_chart.brushOn() && !_filterByArea) {
//       circle.on("click", selectFilter);
//     }
//     _circleList[k] = circle;
//     return circle;
//   };

//   const zoomStart = function(e) {
//     _zooming = true;
//   };

//   const zoomFilter = function(e) {
//     if (e.type === "moveend" && (_zooming || e.hard)) {
//       return;
//     }
//     _zooming = false;

//     _disableFitOnRedraw = true;

//     if (_filterByArea) {
//       let filter;
//       if (
//         _chart
//           .map()
//           .getCenter()
//           .equals(_chart.center()) &&
//         _chart.map().getZoom() === _chart.zoom()
//       ) {
//         filter = null;
//       } else {
//         filter = _chart.map().getBounds();
//       }
//       dc.events.trigger(function() {
//         _chart.filter(null);
//         if (filter) {
//           _innerFilter = true;
//           _chart.filter(filter);
//           _innerFilter = false;
//         }
//         dc.redrawAll(_chart.chartGroup());
//       });
//     } else if (
//       _chart.filter() &&
//       (e.type === "click" ||
//         (_circleList.hasOwnProperty(_chart.filter()) &&
//           !_chart
//             .map()
//             .getBounds()
//             .contains(_circleList[_chart.filter()].getLatLng())))
//     ) {
//       dc.events.trigger(function() {
//         _chart.filter(null);
//         if (_renderPopup) {
//           _chart.map().closePopup();
//         }
//         dc.redrawAll(_chart.chartGroup());
//       });
//     }
//   };

//   const doFilterByArea = function(dimension, filters) {
//     _disableFitOnRedraw = true;
//     _chart.dimension().filter(null);
//     if (filters && filters.length > 0) {
//       _chart.dimension().filterFunction(function(d) {
//         if (!(d in _circleList)) {
//           return false;
//         }
//         const locO = _circleList[d].getLatLng();
//         return locO && filters[0].contains(locO);
//       });
//       if (!_innerFilter && _chart.map().getBounds().toString !== filters[0].toString()) {
//         _chart.map().fitBounds(filters[0]);
//       }
//     }
//   };

//   return _chart.anchor(parent, chartGroup);
// }

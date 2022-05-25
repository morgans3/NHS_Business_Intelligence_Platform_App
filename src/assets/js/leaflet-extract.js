/* eslint-disable */
/* !
 * dc-addons v0.13.5
 *
 * 2018-06-22 09:54:20
 *
 */
(function () {
    "use strict";

    if (dc.baseMapChart) {
        return false;
    }

    dc.baseMapChart = function (_chart) {
        _chart = dc.baseChart(_chart);

        let _map;
        let _mapOpacity = false;

        let _renderPopup = true;
        let _mapOptions = false;
        let _defaultCenter = false;
        let _defaultZoom = false;
        let _brushOn = false;

        let _tiles = function (map) {
            // /*
            //  * L.TileLayer.Grayscale is a regular tilelayer with grayscale makeover.
            //  */
            // L.TileLayer.Grayscale = L.TileLayer.extend({
            //     options: {
            //         quotaRed: 21,
            //         quotaGreen: 71,
            //         quotaBlue: 8,
            //         quotaDividerTune: 0,
            //         quotaDivider: function() {
            //             return this.quotaRed + this.quotaGreen + this.quotaBlue + this.quotaDividerTune;
            //         }
            //     },
            //
            //     initialize: function (url, options) {
            //         options = options || {}
            //         options.crossOrigin = true;
            //         L.TileLayer.prototype.initialize.call(this, url, options);
            //
            //         this.on('tileload', function(e) {
            //             this._makeGrayscale(e.tile);
            //         });
            //     },
            //
            //     _createTile: function () {
            //         var tile = L.TileLayer.prototype._createTile.call(this);
            //         tile.crossOrigin = "Anonymous";
            //         return tile;
            //     },
            //
            //     _makeGrayscale: function (img) {
            //         if (img.getAttribute('data-grayscaled'))
            //             return;
            //
            //    img.crossOrigin = '';
            //         var canvas = document.createElement("canvas");
            //         canvas.width = img.width;
            //         canvas.height = img.height;
            //         var ctx = canvas.getContext("2d");
            //         ctx.drawImage(img, 0, 0);
            //
            //         var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
            //         var pix = imgd.data;
            //         for (var i = 0, n = pix.length; i < n; i += 4) {
            //      pix[i] = pix[i + 1] = pix[i + 2] = (this.options.quotaRed * pix[i] + this.options.quotaGreen * pix[i + 1] + this.options.quotaBlue * pix[i + 2]) / this.options.quotaDivider();
            //         }
            //         ctx.putImageData(imgd, 0, 0);
            //         img.setAttribute('data-grayscaled', true);
            //         img.src = canvas.toDataURL();
            //     }
            // });
            //
            // L.tileLayer.grayscale = function (url, options) {
            //   return new L.TileLayer.Grayscale(url, options);
            // };
            //
            // L.tileLayer.grayscale(
            //     'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
            //     {
            //         attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            //         opacity: _mapOpacity,
            //         fadeAnimation: false
            //     }
            // ).addTo(map);

            L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
                attribution: "&copy; <a href=\"http://osm.org/copyright\">OpenStreetMap</a> contributors",
                opacity: _mapOpacity,
                fadeAnimation: false,
            }).addTo(map);
        };

        let _popup = function (d) {
            return _chart.title()(d);
        };

        _chart._doRender = function () {
            // abstract
        };

        _chart._postRender = function () {
            // abstract
        };

        _chart.toLocArray = function () {
            // abstract
        };

        _chart.mapOptions = function (_) {
            if (!arguments.length) {
                return _mapOptions;
            }

            _mapOptions = _;
            return _chart;
        };

        _chart.center = function (_) {
            if (!arguments.length) {
                return _defaultCenter;
            }

            _defaultCenter = _;
            return _chart;
        };

        _chart.getCenter = function (_) {
            return _map.getCenter();
        };

        _chart.zoom = function (_) {
            if (!arguments.length) {
                return _defaultZoom;
            }

            _defaultZoom = _;
            return _chart;
        };

        _chart.getZoom = function (_) {
            return _map.getZoom();
        };

        _chart.tiles = function (_) {
            if (!arguments.length) {
                return _tiles;
            }

            _tiles = _;
            return _chart;
        };

        _chart.changeOpacity = function (_) {
            if (!arguments.length) {
                return _mapOpacity;
            }

            _mapOpacity = _;
            return _chart;
        };

        _chart.map = function (_) {
            if (!arguments.length) {
                return _map;
            }

            _map = _;
            return _map;
        };

        _chart.popup = function (_) {
            if (!arguments.length) {
                return _popup;
            }

            _popup = _;
            return _chart;
        };

        _chart.renderPopup = function (_) {
            if (!arguments.length) {
                return _renderPopup;
            }

            _renderPopup = _;
            return _chart;
        };

        _chart.brushOn = function (_) {
            if (!arguments.length) {
                return _brushOn;
            }

            _brushOn = _;
            return _chart;
        };

        return _chart;
    };
})();

(function () {
    "use strict";

    if (dc.baseLeafletChart) {
        return false;
    }

    dc.baseLeafletChart = function (_chart) {
        _chart = dc.baseMapChart(_chart);

        _chart._doRender = function () {
            const _map = L.map(_chart.root().node(), _chart.mapOptions());

            if (_chart.center() && _chart.zoom()) {
                _map.setView(_chart.toLocArray(_chart.center()), _chart.zoom());
            }

            _chart.tiles()(_map);

            _chart.map(_map);

            _chart._postRender();

            return _chart._doRedraw();
        };

        _chart.toLocArray = function (value) {
            if (typeof value === "string") {
                // expects '11.111,1.111'
                value = value.split(",");
            }
            // else expects [11.111,1.111]
            return value;
        };

        return _chart;
    };
})();

(function () {
    "use strict";

    if (dc.leafletChoroplethChart) {
        return false;
    }

    dc.leafletChoroplethChart = function (parent, chartGroup) {
        const _chart = dc.colorChart(dc.baseLeafletChart({}));

        let _geojsonLayer = false;
        let _dataMap = [];

        let _geojson = false;
        let _featureOptions = {
            fillColor: "black",
            color: "gray",
            opacity: 0.4,
            fillOpacity: 0.6,
            weight: 1,
        };

        const _renderPopup = true;
        const _popupOnHover = true;

        let _featureKey = function (feature) {
            return feature.key;
        };

        let _featureStyle = function (feature) {
            const v = _dataMap[_chart.featureKeyAccessor()(feature)];

            let options = _chart.featureOptions();
            const optionsIsFunction = options instanceof Function;

            if (optionsIsFunction) {
                options = options(feature, v);
            }
            options = JSON.parse(JSON.stringify(options));

            if (v && v.d && !optionsIsFunction) {
                options.fillColor = _chart.getColor(v.d, v.i);
                if (_chart.filters().indexOf(v.d.key) !== -1) {
                    options.opacity = 0.8;
                    options.fillOpacity = 1;
                }
            }
            return options;
        };

        _chart._postRender = function () {
            _geojsonLayer = L.geoJson(_chart.geojson(), {
                style: _chart.featureStyle(),
                onEachFeature: processFeatures,
            });
            _chart.map().addLayer(_geojsonLayer);
        };

        _chart._doRedraw = function () {
            _geojsonLayer.clearLayers();
            _dataMap = [];
            _chart._computeOrderedGroups(_chart.data()).forEach(function (d, i) {
                _dataMap[_chart.keyAccessor()(d)] = { d, i };
            });
            _geojsonLayer.addData(_chart.geojson());
        };

        _chart.geojson = function (_) {
            if (!arguments.length) {
                return _geojson;
            }

            _geojson = _;
            return _chart;
        };

        _chart.featureOptions = function (_) {
            if (!arguments.length) {
                return _featureOptions;
            }

            _featureOptions = _;
            return _chart;
        };

        _chart.featureKeyAccessor = function (_) {
            if (!arguments.length) {
                return _featureKey;
            }

            _featureKey = _;
            return _chart;
        };

        _chart.featureStyle = function (_) {
            if (!arguments.length) {
                return _featureStyle;
            }

            _featureStyle = _;
            return _chart;
        };

        var processFeatures = function (feature, layer) {
            let v = _dataMap[_chart.featureKeyAccessor()(feature)];
            if (feature.properties.f6 && feature.properties.f1) {
                v = { d: { key: feature.properties.f1, value: feature.properties.f6 } };

                if (!layer.key && layer.feature.properties.f1) {
                    layer.key = layer.feature.properties.f1;
                }
            }
            if (v && v.d) {
                layer.key = v.d.key;
                if (_chart.renderPopup()) {
                    if (feature.properties.crude_rate_per_thousand || feature.properties.crude_rate_per_thousand == 0) {
                        v.d.value = [Math.round(100 * feature.properties.crude_rate_per_thousand) / 100, Math.round(100 * feature.properties.lowercl) / 100, Math.round(100 * feature.properties.uppercl) / 100, feature.properties.positives, feature.start_date, feature.end_date, Math.round(100 * feature.properties.rate_diff) / 100, feature.properties.care_home_ratio];
                    }
                    if (feature.properties.relative_score) {
                        v.d.value = Math.round(100 * feature.properties.relative_score) / 100;
                    }
                    if (feature.properties.f6 && feature.properties.f2) {
                        v.d.value = [Math.round(feature.properties.f2 / 60), Math.round(100 * feature.properties.f6) / 100];
                    }
                    layer.bindPopup(_chart.popup()(v.d, feature), { autoPan: false });
                    layer.on("mouseover", function (e) {
                        this.openPopup();
                        e.target.getElement().setAttribute("class", "leaflet-interactive");
                        if (feature.properties.area || feature.properties.f1) {
                            const popup = e.target.getPopup();
                            popup.setLatLng(e.latlng).openOn(_chart.map());

                            layer.setStyle({
                                weight: 3,
                                color: "#422703",
                            });
                        }
                    });
                    layer.on("mouseout", function (e) {
                        this.closePopup();
                        _geojsonLayer.resetStyle(e.target);
                        e.target.getElement().setAttribute("class", "leaflet-interactive leaflet-interactive-edge");
                    });
                    layer.on("click", function (e) {
                        _chart.map().fitBounds(e.target.getBounds());
                    });
                }

                if (_chart.brushOn()) {
                    layer.on("click", selectFilter);
                }
            }
        };

        var selectFilter = function (e) {
            if (!e.target) {
                return;
            }

            const filter = e.target.key;
            dc.events.trigger(function () {
                _chart.filter(filter);
                dc.redrawAll(_chart.chartGroup());
            });
        };

        return _chart.anchor(parent, chartGroup);
    };
})();

(function () {
    "use strict";

    if (dc.leafletMarkerChart) {
        return false;
    }

    dc.leafletMarkerChart = function (parent, chartGroup) {
        const _chart = dc.baseLeafletChart({});

        let _cluster = false; // requires leaflet.markerCluster
        let _clusterOptions = false;
        let _rebuildMarkers = false;
        let _brushOn = true;
        let _filterByArea = false;

        let _innerFilter = false;
        let _zooming = false;
        let _layerGroup = false;
        let _markerList = {};

        let _fitOnRender = true;
        let _fitOnRedraw = false;
        let _disableFitOnRedraw = false;

        let _renderPopup = true;
        let _popupOnHover = true;

        _chart.renderTitle(true);

        let _location = function (d) {
            return _chart.keyAccessor()(d);
        };

        let _marker = function (d) {
            const marker = new L.Marker(_chart.toLocArray(_chart.locationAccessor()(d)), {
                title: _chart.renderTitle() ? _chart.title()(d) : "",
                alt: _chart.renderTitle() ? _chart.title()(d) : "",
                icon: _icon(d, _chart.map()),
                clickable: _chart.renderPopup() || (_chart.brushOn() && !_filterByArea),
                draggable: false,
            });
            return marker;
        };

        var _icon = function (d, map) {
            return new L.Icon.Default();
        };

        let _popup = function (d, marker) {
            return _chart.title()(d);
        };

        _chart._postRender = function () {
            if (_chart.brushOn()) {
                if (_filterByArea) {
                    _chart.filterHandler(doFilterByArea);
                }

                _chart.map().on("zoomend moveend", zoomFilter, this);
                if (!_filterByArea) {
                    _chart.map().on("click", zoomFilter, this);
                }
                _chart.map().on("zoomstart", zoomStart, this);
            }

            if (_cluster) {
                _layerGroup = new L.MarkerClusterGroup(_clusterOptions ? _clusterOptions : null);
            } else {
                _layerGroup = new L.LayerGroup();
            }
            _chart.map().addLayer(_layerGroup);
        };

        _chart._doRedraw = function () {
            const groups = _chart._computeOrderedGroups(_chart.data()).filter(function (d) {
                return _chart.valueAccessor()(d) !== 0;
            });

            if (_rebuildMarkers) {
                _markerList = {};
            }
            _layerGroup.clearLayers();
            if (_layerGroup) {
                _layerGroup.clearLayers();
            } else {
                _layerGroup = layerGroup;
                _layerGroup.clearLayers();
            }

            const addList = [];
            groups.forEach(function (v, i) {
                const key = _chart.keyAccessor()(v);
                let marker = null;
                if (!_rebuildMarkers && key in _markerList) {
                    marker = _markerList[key];
                } else {
                    marker = createmarker(v, key);
                }

                const curFilters = _chart.filters();
                let markerOpacity = curFilters.length ? 0.3 : 1.0;
                curFilters.forEach(function (filter) {
                    if (key === filter) {
                        markerOpacity = 1.0;
                    }
                });
                marker.setOpacity(markerOpacity);

                if (!_chart.cluster()) {
                    _layerGroup.addLayer(marker);
                } else {
                    addList.push(marker);
                }
            });

            if (_chart.cluster() && addList.length > 0) {
                _layerGroup.addLayers(addList);
            }

            if (addList.length > 0) {
                if (_fitOnRender || (_fitOnRedraw && !_disableFitOnRedraw)) {
                    const featureGroup = new L.featureGroup(addList);
                    _chart.map().fitBounds(featureGroup.getBounds()); // .pad(0.5));
                }
            }

            _disableFitOnRedraw = false;
            _fitOnRender = false;
        };

        _chart.locationAccessor = function (_) {
            if (!arguments.length) {
                return _location;
            }
            _location = _;
            return _chart;
        };

        _chart.marker = function (_) {
            if (!arguments.length) {
                return _marker;
            }
            _marker = _;
            return _chart;
        };

        _chart.icon = function (_) {
            if (!arguments.length) {
                return _icon;
            }
            _icon = _;
            return _chart;
        };

        _chart.popup = function (_) {
            if (!arguments.length) {
                return _popup;
            }
            _popup = _;
            return _chart;
        };

        _chart.renderPopup = function (_) {
            if (!arguments.length) {
                return _renderPopup;
            }
            _renderPopup = _;
            return _chart;
        };

        _chart.popupOnHover = function (_) {
            if (!arguments.length) {
                return _popupOnHover;
            }
            _popupOnHover = _;
            return _chart;
        };

        _chart.cluster = function (_) {
            if (!arguments.length) {
                return _cluster;
            }
            _cluster = _;
            return _chart;
        };

        _chart.clusterOptions = function (_) {
            if (!arguments.length) {
                return _clusterOptions;
            }
            _clusterOptions = _;
            return _chart;
        };

        _chart.rebuildMarkers = function (_) {
            if (!arguments.length) {
                return _rebuildMarkers;
            }
            _rebuildMarkers = _;
            return _chart;
        };

        _chart.brushOn = function (_) {
            if (!arguments.length) {
                return _brushOn;
            }
            _brushOn = _;
            return _chart;
        };

        _chart.filterByArea = function (_) {
            if (!arguments.length) {
                return _filterByArea;
            }
            _filterByArea = _;
            return _chart;
        };

        _chart.fitOnRender = function (_) {
            if (!arguments.length) {
                return _fitOnRender;
            }

            _fitOnRender = _;
            return _chart;
        };

        _chart.fitOnRedraw = function (_) {
            if (!arguments.length) {
                return _fitOnRedraw;
            }

            _fitOnRedraw = _;
            return _chart;
        };

        _chart.markerGroup = function () {
            return _layerGroup;
        };

        var createmarker = function (v, k) {
            const marker = _marker(v);
            marker.key = k;
            if (_chart.renderPopup()) {
                marker.bindPopup(_chart.popup()(v, marker), { autoPan: false });

                if (_chart.popupOnHover()) {
                    marker.on("mouseover", function () {
                        marker.openPopup();
                    });

                    marker.on("mouseout", function () {
                        marker.closePopup();
                    });
                }
            }

            if (_chart.brushOn() && !_filterByArea) {
                marker.on("click", selectFilter);
            }
            _markerList[k] = marker;
            return marker;
        };

        var zoomStart = function (e) {
            _zooming = true;
        };

        var zoomFilter = function (e) {
            if (e.type === "moveend" && (_zooming || e.hard)) {
                return;
            }
            _zooming = false;

            _disableFitOnRedraw = true;

            if (_filterByArea) {
                let filter;
                if (_chart.map().getCenter().equals(_chart.center()) && _chart.map().getZoom() === _chart.zoom()) {
                    filter = null;
                } else {
                    filter = _chart.map().getBounds();
                }
                dc.events.trigger(function () {
                    _chart.filter(null);
                    if (filter) {
                        _innerFilter = true;
                        _chart.filter(filter);
                        _innerFilter = false;
                    }
                    dc.redrawAll(_chart.chartGroup());
                });
            } else if (_chart.filter() && (e.type === "click" || (_markerList.hasOwnProperty(_chart.filter()) && !_chart.map().getBounds().contains(_markerList[_chart.filter()].getLatLng())))) {
                dc.events.trigger(function () {
                    _chart.filter(null);
                    if (_renderPopup) {
                        _chart.map().closePopup();
                    }
                    dc.redrawAll(_chart.chartGroup());
                });
            }
        };

        var doFilterByArea = function (dimension, filters) {
            _disableFitOnRedraw = true;
            _chart.dimension().filter(null);
            if (filters && filters.length > 0) {
                _chart.dimension().filterFunction(function (d) {
                    if (!(d in _markerList)) {
                        return false;
                    }
                    const locO = _markerList[d].getLatLng();
                    return locO && filters[0].contains(locO);
                });
                if (!_innerFilter && _chart.map().getBounds().toString !== filters[0].toString()) {
                    _chart.map().fitBounds(filters[0]);
                }
            }
        };

        var selectFilter = function (e) {
            if (!e.target) {
                return;
            }

            _disableFitOnRedraw = true;
            const filter = e.target.key;
            dc.events.trigger(function () {
                _chart.filter(filter);
                dc.redrawAll(_chart.chartGroup());
            });
        };

        return _chart.anchor(parent, chartGroup);
    };
})();

// Declare global layerGroup variable as javascript keeps losing it
let layerGroup;

(function () {
    "use strict";

    if (dc.leafletCustomChart) {
        return false;
    }

    dc.leafletCustomChart = function (parent, chartGroup) {
        const _chart = dc.baseLeafletChart({});

        let _redrawItem = null;
        let _renderItem = null;

        _chart.renderTitle(true);

        _chart._postRender = function () {
            const data = _chart._computeOrderedGroups(_chart.data());

            data.forEach(function (d, i) {
                _chart.renderItem()(_chart, _chart.map(), d, i);
            });
        };

        _chart._doRedraw = function () {
            const data = _chart._computeOrderedGroups(_chart.data());

            const accessor = _chart.valueAccessor();

            data.forEach(function (d, i) {
                d.filtered = accessor(d) === 0;
                _chart.redrawItem()(_chart, _chart.map(), d, i);
            });
        };

        _chart.redrawItem = function (_) {
            if (!arguments.length) {
                return _redrawItem;
            }

            _redrawItem = _;
            return _chart;
        };

        _chart.renderItem = function (_) {
            if (!arguments.length) {
                return _renderItem;
            }

            _renderItem = _;
            return _chart;
        };

        return _chart.anchor(parent, chartGroup);
    };
})();

(function () {
    "use strict";

    if (dc.leafletMarkerChartBubble) {
        return false;
    }

    dc.leafletMarkerChartBubble = function (parent, chartGroup) {
        const _chart = dc.baseLeafletChart({});

        let _cluster = false; // requires leaflet.circleCluster
        let _clusterOptions = false;
        let _rebuildcircles = false;
        let _brushOn = true;
        let _filterByArea = false;

        let _innerFilter = false;
        let _zooming = false;
        let _layerGroup = false;
        let _circleList = {};

        let _fitOnRender = true;
        let _fitOnRedraw = false;
        let _disableFitOnRedraw = false;

        let _renderPopup = true;
        let _popupOnHover = true;

        let _circleScale = 30;

        _chart.renderTitle(true);

        let _location = function (d) {
            return _chart.keyAccessor()(d);
        };

        _chart.circleScale = function (_) {
            if (!arguments.length) {
                return _circleScale;
            }
            _circleScale = _;
            return _chart;
        };

        let _circle = function (d) {
            if (_cluster) {
                circle = new L.circleMarker(_chart.toLocArray(_chart.locationAccessor()(d)), {
                    sizeValue: d.value,
                    scaleFactor: _circleScale,
                    radius: Math.sqrt((d.value * _circleScale) / Math.PI),
                    clickable: _chart.renderPopup() || (_chart.brushOn() && !_filterByArea),
                    color: "#4D75BA",
                    fillColor: "#E03F8B",
                    fillOpacity: 0.8,
                    weight: 1,
                    draggable: false,
                });
            } else {
                var circle = new L.circle(_chart.toLocArray(_chart.locationAccessor()(d)), {
                    sizeValue: d.value,
                    scaleFactor: _circleScale,
                    radius: Math.sqrt((d.value * _circleScale) / Math.PI),
                    clickable: _chart.renderPopup() || (_chart.brushOn() && !_filterByArea),
                    color: "#4D75BA",
                    fillColor: "#E03F8B",
                    fillOpacity: 0.8,
                    weight: 1,
                    draggable: false,
                });
            }
            return circle;
        };

        let _icon = function (d, map) {
            return new L.Icon.Default();
        };

        let _popup = function (d, circle) {
            return _chart.title()(d);
        };

        _chart._postRender = function () {
            if (_chart.brushOn()) {
                if (_filterByArea) {
                    _chart.filterHandler(doFilterByArea);
                }

                _chart.map().on("zoomend moveend", zoomFilter, this);
                if (!_filterByArea) {
                    _chart.map().on("click", zoomFilter, this);
                }
                _chart.map().on("zoomstart", zoomStart, this);
            }

            if (_cluster) {
                _layerGroup = new L.markerClusterGroup(_clusterOptions ? _clusterOptions : null);
            } else {
                _layerGroup = new L.LayerGroup();
            }

            layerGroup = _layerGroup;

            _chart.map().addLayer(_layerGroup);
        };

        _chart._doRedraw = function () {
            const groups = _chart._computeOrderedGroups(_chart.data()).filter(function (d) {
                return _chart.valueAccessor()(d) !== 0;
            });

            if (_rebuildcircles) {
                _circleList = {};
            }

            if (_layerGroup) {
                _layerGroup.clearLayers();
            } else {
                _layerGroup = layerGroup;
                _layerGroup.clearLayers();
            }
            const addList = [];
            groups.forEach(function (v, i) {
                const key = _chart.keyAccessor()(v);
                let circle = null;
                if (!_rebuildcircles && key in _circleList) {
                    circle = _circleList[key];
                } else {
                    circle = createcircle(v, key);
                }

                const curFilters = _chart.filters();
                let circleOpacity = curFilters.length ? 0.1 : 0.8;
                curFilters.forEach(function (filter) {
                    if (key === filter) {
                        circleOpacity = 0.8;
                    }
                });

                // THIS NEEDS SORTING

                circle.options.scaleFactor = _circleScale;
                circle.setStyle({ fillOpacity: circleOpacity });
                circle.setRadius(Math.sqrt((v.value * _circleScale) / Math.PI));

                if (_chart.renderPopup()) {
                    circle.bindPopup(_chart.popup()(v, circle), { autoPan: false });

                    if (_chart.popupOnHover()) {
                        circle.on("mouseover", function () {
                            circle.openPopup();
                        });

                        circle.on("mouseout", function () {
                            circle.closePopup();
                        });
                    }
                }

                if (!_chart.cluster()) {
                    _layerGroup.addLayer(circle);
                } else {
                    addList.push(circle);
                }
            });

            if (_chart.cluster() && addList.length > 0) {
                _layerGroup.addLayers(addList);
            }

            if (addList.length > 0) {
                if (_fitOnRender || (_fitOnRedraw && !_disableFitOnRedraw)) {
                    const featureGroup = new L.featureGroup(addList);
                    _chart.map().fitBounds(featureGroup.getBounds()); // .pad(0.5));
                }
            }

            layerGroup = _layerGroup;

            _disableFitOnRedraw = false;
            _fitOnRender = false;
        };

        _chart.locationAccessor = function (_) {
            if (!arguments.length) {
                return _location;
            }
            _location = _;
            return _chart;
        };

        _chart.circle = function (_) {
            if (!arguments.length) {
                return _circle;
            }
            _circle = _;
            return _chart;
        };

        _chart.icon = function (_) {
            if (!arguments.length) {
                return _icon;
            }
            _icon = _;
            return _chart;
        };

        _chart.popup = function (_) {
            if (!arguments.length) {
                return _popup;
            }
            _popup = _;
            return _chart;
        };

        _chart.renderPopup = function (_) {
            if (!arguments.length) {
                return _renderPopup;
            }
            _renderPopup = _;
            return _chart;
        };

        _chart.popupOnHover = function (_) {
            if (!arguments.length) {
                return _popupOnHover;
            }
            _popupOnHover = _;
            return _chart;
        };

        _chart.cluster = function (_) {
            if (!arguments.length) {
                return _cluster;
            }
            _cluster = _;
            return _chart;
        };

        _chart.clusterOptions = function (_) {
            if (!arguments.length) {
                return _clusterOptions;
            }
            _clusterOptions = _;
            return _chart;
        };

        _chart.rebuildcircles = function (_) {
            if (!arguments.length) {
                return _rebuildcircles;
            }
            _rebuildcircles = _;
            return _chart;
        };

        _chart.brushOn = function (_) {
            if (!arguments.length) {
                return _brushOn;
            }
            _brushOn = _;
            return _chart;
        };

        _chart.filterByArea = function (_) {
            if (!arguments.length) {
                return _filterByArea;
            }
            _filterByArea = _;
            return _chart;
        };

        _chart.fitOnRender = function (_) {
            if (!arguments.length) {
                return _fitOnRender;
            }

            _fitOnRender = _;
            return _chart;
        };

        _chart.fitOnRedraw = function (_) {
            if (!arguments.length) {
                return _fitOnRedraw;
            }

            _fitOnRedraw = _;
            return _chart;
        };

        _chart.circleGroup = function () {
            return _layerGroup;
        };

        var createcircle = function (v, k) {
            const circle = _circle(v);
            circle.key = k;
            if (_chart.renderPopup()) {
                circle.bindPopup(_chart.popup()(v, circle), { autoPan: false });

                if (_chart.popupOnHover()) {
                    circle.on("mouseover", function () {
                        circle.openPopup();
                    });

                    circle.on("mouseout", function () {
                        circle.closePopup();
                    });
                }
            }

            if (_chart.brushOn() && !_filterByArea) {
                circle.on("click", selectFilter);
            }
            _circleList[k] = circle;
            return circle;
        };

        var zoomStart = function (e) {
            _zooming = true;
        };

        var zoomFilter = function (e) {
            if (e.type === "moveend" && (_zooming || e.hard)) {
                return;
            }
            _zooming = false;

            _disableFitOnRedraw = true;

            if (_filterByArea) {
                let filter;
                if (_chart.map().getCenter().equals(_chart.center()) && _chart.map().getZoom() === _chart.zoom()) {
                    filter = null;
                } else {
                    filter = _chart.map().getBounds();
                }
                dc.events.trigger(function () {
                    _chart.filter(null);
                    if (filter) {
                        _innerFilter = true;
                        _chart.filter(filter);
                        _innerFilter = false;
                    }
                    dc.redrawAll(_chart.chartGroup());
                });
            } else if (_chart.filter() && (e.type === "click" || (_circleList.hasOwnProperty(_chart.filter()) && !_chart.map().getBounds().contains(_circleList[_chart.filter()].getLatLng())))) {
                dc.events.trigger(function () {
                    _chart.filter(null);
                    if (_renderPopup) {
                        _chart.map().closePopup();
                    }
                    dc.redrawAll(_chart.chartGroup());
                });
            }
        };

        var doFilterByArea = function (dimension, filters) {
            _disableFitOnRedraw = true;
            _chart.dimension().filter(null);
            if (filters && filters.length > 0) {
                _chart.dimension().filterFunction(function (d) {
                    if (!(d in _circleList)) {
                        return false;
                    }
                    const locO = _circleList[d].getLatLng();
                    return locO && filters[0].contains(locO);
                });
                if (!_innerFilter && _chart.map().getBounds().toString !== filters[0].toString()) {
                    _chart.map().fitBounds(filters[0]);
                }
            }
        };

        var selectFilter = function (e) {
            if (!e.target) {
                return;
            }

            _disableFitOnRedraw = true;
            const filter = e.target.key;
            dc.events.trigger(function () {
                _chart.filter(filter);
                dc.redrawAll(_chart.chartGroup());
            });
        };

        return _chart.anchor(parent, chartGroup);
    };
})();

// Legend code adapted from http://leafletjs.com/examples/choropleth.html
dc.leafletLegend = function () {
    let _parent;
    const _legend = {};
    let _leafletLegend = null;
    let _position = "bottomleft";

    _legend.parent = function (parent) {
        if (!arguments.length) {
            return _parent;
        }
        _parent = parent;
        return this;
    };

    let _LegendClass = function () {
        return L.Control.extend({
            options: { position: _position },
            onAdd (map) {
                this._div = L.DomUtil.create("div", "info legend");
                map.on("moveend", this._update, this);
                this._update();
                return this._div;
            },
            _update () {
                if (_parent.colorDomain()) {
                    // check because undefined for marker charts
                    const minValue = _parent.colorDomain()[0];
                    const maxValue = _parent.colorDomain()[1];
                    const palette = _parent.colors().range();
                    const colorLength = _parent.colors().range().length;
                    const delta = (maxValue - minValue) / colorLength;
                    let i;

                    // define grades for legend colours
                    // based on equation in dc.js colorCalculator (before version based on colorMixin)
                    const grades = [];
                    grades[0] = Math.round(minValue);
                    for (i = 1; i < colorLength; i++) {
                        grades[i] = Math.round((0.5 + (i - 1)) * delta + minValue);
                    }

                    // var div = L.DomUtil.create('div', 'info legend');
                    // loop through our density intervals and generate a label with a colored
                    // square for each interval
                    this._div.innerHTML = ""; // reset so that legend is not plotted multiple times
                    for (i = 0; i < grades.length; i++) {
                        this._div.innerHTML += "<i style=\"background:" + palette[i] + "\"></i> " + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
                    }
                }
            },
        });
    };

    _legend.LegendClass = function (LegendClass) {
        if (!arguments.length) {
            return _LegendClass;
        }

        _LegendClass = LegendClass;
        return _legend;
    };

    _legend.render = function () {
    // unfortunately the dc.js legend has no concept of redraw, it's always render
        if (!_leafletLegend) {
            // fetch the legend class creator, invoke it
            const Legend = _legend.LegendClass()();
            // and constuct that class
            _leafletLegend = new Legend();
            _leafletLegend.addTo(_parent.map());
        }

        return _legend.redraw();
    };

    _legend.redraw = function () {
        _leafletLegend._update();
        return _legend;
    };

    _legend.leafletLegend = function () {
        return _leafletLegend;
    };

    _legend.position = function (position) {
        if (!arguments.length) {
            return _position;
        }
        _position = position;
        return _legend;
    };

    return _legend;
};

const leafletChoroplethChart = dc.leafletChoroplethChart;
const leafletLegend = dc.leafletLegend;
const leafletMarkerChartBubble = dc.leafletMarkerChartBubble;

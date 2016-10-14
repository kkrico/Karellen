﻿(function ($) {
    "use strict";

    var app = (function ($) {
        var _private = {};
        var $public = {};

        // Private

        _private.ConfigurarAjax = function () {
            $(document).ajaxStart(function () {
                    NProgress.start();
                });
            $(document).ajaxStop(function () {
                    NProgress.done();
                });
            $.ajaxSetup({ cache: false });
        };

        _private.ConfigurarChosen = function () {
            $(function() {
                $(".chosen-select").chosen({ no_results_text: "Nada encontrado", width: "100%" });
            });
        };

        _private.ConfigurarDraw = function () {
            L.drawLocal.draw.handlers.marker.tooltip.start = "Click no mapa para inserir o local da ocorrência";
            L.drawLocal.draw.toolbar.buttons.marker = "Insira o local da ocorrência";
            L.drawLocal.edit.toolbar.buttons.edit = "Editar";
            L.drawLocal.edit.toolbar.buttons.remove = "Remover";
            L.Icon.Default.imagePath = _private.url + "/images";
        };

        _private.ConfigurarDateTimePicker = function () {
           $(function() {
               $("#datetimepicker1").datetimepicker({
                   locale: 'pt-br'
               });
           });
        };

        _private.ConfigurarBotaoEdicao = function () {
            $("#sidewrapper").on("click", "#btnedit", function () {
                $("form input[disabled]").removeAttr("disabled");
            });
        };

        _private.OnDrawDeleted = function (event) {

            _private.mapa.removeLayer(_private.drawItens);

            var drawItens = new L.FeatureGroup();
            _private.mapa.addLayer(drawItens);

            var drawControl = new L.Control.Draw({
                draw: {
                    rectangle: false,
                    polyline: false,
                    polygon: false,
                    circle: false,
                    marker: true
                },
                edit: {
                    featureGroup: drawItens,
                    remove: true
                }
            });

            _private.mapa.removeControl(_private.drawControl);

            _private.drawControl = drawControl;
            _private.drawItens = drawItens;

            _private.mapa.addControl(drawControl);
            _private.TraduzirDraw();

            $("#Latitude").val("");
            $("#Longitude").val("");
        }

        _private.OnDrawCreated = function (event) {

            var tipo = event.layerType;
            var layer = event.layer;

            if (tipo === "marker") {

                $("#Latitude").val(layer._latlng.lat);
                $("#Longitude").val(layer._latlng.lng);

                _private.mapa.removeLayer(_private.drawItens);

                var drawItens = new L.FeatureGroup();
                _private.mapa.addLayer(drawItens);

                var drawControl = new L.Control.Draw({
                    draw: {
                        rectangle: false,
                        polyline: false,
                        polygon: false,
                        circle: false,
                        marker: false
                    },
                    edit: {
                        featureGroup: drawItens,
                        remove: true
                    }
                });

                _private.mapa.removeControl(_private.drawControl);

                _private.drawControl = drawControl;
                _private.drawItens = drawItens;

                _private.mapa.addControl(drawControl);
                _private.ConfigurarDraw();
            }

            drawItens.addLayer(layer);
        }

        _private.OnDrawEdited = function(event) {

            var layers = event.layers;
            layers.eachLayer(function(layer) {
                if (layer instanceof L.Marker) {
                    $("#Latitude").val(layer._latlng.lat);
                    $("#Longitude").val(layer._latlng.lng);
                }
            });
        };

        $public.DesabilitarMarcadores = function () {

            _private.mapa.eachLayer(function (layer) {
                if (layer instanceof L.Marker) {
                    _private.mapa.removeLayer(layer);
                }
            });
        }

        $public.SuportaAjax = function () {
            return window.history.length > 0;
        };

        $public.Init = function (url) {

            _private.url = url;
            _private.ConfigurarAjax();
            _private.ConfigurarDraw();
            _private.ConfigurarChosen();
            _private.ConfigurarBotaoEdicao();
        };

        $public.GetGeoJson = function (local, callback) {

            var options = {
                url: _private.url + local,
                method: 'GET'
            };

            $.ajax(options)
                .done(function (data, res) {
                    callback(data, res, _private.mapa);
                    L.geoJson(data).addTo(_private.mapa);
                });
        };

        $public.IniciarMapa = function (elemento, coordenadas, zoom) {

            _private.zoom = zoom;
            _private.coordenadas = coordenadas;
            _private.elemento = elemento;
            _private.mapa = L.map(elemento).setView(coordenadas, zoom);
            _private.Token = 'pk.eyJ1Ijoia2tyaWNvIiwiYSI6ImNpc3l5bGtsNDBmcDQycGtoOTgwN3JtN3IifQ.Bc9quEp60HksbmydwEUJqw';
            var options = {
                id: 'mapbox.streets',
                minZoom: 10,
                maxZoom: 20,
                attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> &copy; | <a href="http://mapbox.com">Mapbox</a> &copy; sobre ' +
                                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>.'
            };

            _private.mapaUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + _private.Token;
            _private.TitleLayer = L.tileLayer(_private.mapaUrl, options).addTo(_private.mapa);
        };

        $public.DestruirMapa = function() {
            _private.mapa.off();
            _private.mapa.remove();
        };

        $public.HabilitarEdicao = function () {

            $public.DestruirMapa();
            $public.IniciarMapa(_private.elemento, _private.coordenadas, _private.zoom);

            var drawItens = new L.FeatureGroup();
            _private.mapa.addLayer(drawItens);

            var drawControl = new L.Control.Draw({
                    draw: {
                        rectangle: false,
                        polyline: false,
                        polygon: false,
                        circle: false,
                        marker: true
                    },
                    edit: {
                        featureGroup: drawItens,
                        remove: true
                    }
                });
            _private.drawControl = drawControl;
            _private.drawItens = drawItens;

            _private.mapa.addControl(drawControl);
            _private.ConfigurarDraw();


            _private.mapa.on("draw:created", _private.OnDrawCreated);
            _private.mapa.on("draw:deleted", _private.OnDrawDeleted);
            _private.mapa.on("draw:edited", _private.OnDrawEdited);

            _private.ConfigurarChosen();
            _private.ConfigurarDateTimePicker();
        }

        return $public;

    })($);

    window.App = app;
})(jQuery);
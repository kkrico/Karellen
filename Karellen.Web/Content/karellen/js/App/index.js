﻿$(function () {

    if (App.SuportaAjax()) {
        App.IniciarMapa("mapa", [-15.64511, -47.78214], 14);

        var locations = App.GetGeoJson("/ocorrencia/coordenadas");
        locations.on('ready', function () {

            var cluster = new L.MarkerClusterGroup({
                maxClusterRadius: 80
            });

            var allLayers = locations._layers;
            var ar = $.map(allLayers, function (value, index) {
                return [value];
            });
            cluster.addLayers(ar);
            App.AddLayer(cluster);


            // Para cada layer
            locations.eachLayer(function (layer) {
                debugger;

                var prop = layer.feature.properties;

                var popup = '<h3>' + prop.Nome + '</h3>';
                popup += '<div>' + prop.Detalhes + '</div>';

                var listing = listings.appendChild(document.createElement('div'));
                listing.className = 'item';

                listing.appendChild(document.createElement('h4'));
                var link = listing.childNodes[0].appendChild(document.createElement('a'));
                link.href = '#';
                link.className = 'title';

                link.innerHTML = prop.Nome;
                if (prop.Data) {
                    // Cria 
                    popup += '<br /><small class="quiet" style="text-align:center"><i class="fa fa-calendar" aria-hidden="true"></i>&nbsp' + prop.Data + '</small>';
                    popup += '<br /><a href="' +
                        App.Url() +
                        "/ocorrencia/detalhes/" +
                        prop.Id +
                        '" type="button" data-title="Detalhes" data-pjax data-callback="Detalhes"' +
                        ' class="btn btn-primary btn-default btnsaibamais" style="color: white">Saiba mais</a>';
                }

                if (prop.UsuarioId != null) {
                    popup += '<a href="' +
                        App.Url() +
                        "/ocorrencia/editar/" +
                        prop.Id +
                        '" type="button" style="margin-left:1em; color:white;" data-title="Editar" data-pjax data-callback="Editar"' +
                        ' class="btn btn-primary btn-default btnsaibamais" style="color: white">' +
                        '<i class="fa fa-pencil" aria-hidden="true"></i> Editar</a>';

                    popup += '<button type="button" data-toggle="modal" data-hidden="'+ prop.Id +'" data-target="#myModal" style="margin-left:1em; color:white;"' +
                        ' class="btn btn-primary btn-default btnsaibamais" style="color: white">' +
                        '<i class="fa fa-check" aria-hidden="true"></i> Solucionar</a>';
                    link.innerHTML += ' <i class="fa fa-pencil" aria-hidden="true"></i>'
                }

                var details = listing.appendChild(document.createElement('div'));
                details.innerHTML = prop.Data;
                

                popup += '</div>';
                layer.bindPopup(popup);

                layer.on('click', function (e) {

                    // 2. Set active the markers associated listing.
                    setActive(listing);
                });

                link.onclick = function () {
                    setActive(listing);

                    layer.openPopup();
                    return false;
                };

            });

        });

        locations.on('layeradd', function (e) {

            var marker = e.layer;
            marker.setIcon(L.icon({
                iconUrl: App.Url() + '/content/karellen/img/robbery.png', // load your own custom marker image here
                iconSize: [32, 32],
                iconAnchor: [28, 28],
                popupAnchor: [0, -34]
            }));
            
        });
    }
});

function setActive(el) {
    var siblings = listings.getElementsByTagName('div');
    for (var i = 0; i < siblings.length; i++) {
        siblings[i].className = siblings[i].className
          .replace(/active/, '').replace(/\s\s*$/, '');
    }

    el.className += ' active';
}

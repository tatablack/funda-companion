$(function() {
    window.addEventListener("message", showMap, false);

    var template,
        mapOptions = {
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

    function showMap(event) {
        if (!template) {
            $.when($.get(chrome.extension.getURL('../templates/detail.jade'))).done(function(detailResult) {
                template = jade.compile(detailResult);

                showMap(event);
            });

            return;
        }

        if (event.data.method === 'showMapDetail') {
            showMapDetail(event.data.listing);
        } else if (event.data.method === 'showMapComplete') {
            showMapComplete(event.data.listings);
        }
    }

    function showMapDetail(listing) {
        var location = new google.maps.LatLng(
                listing.coordinates.results[0].geometry.location.lat,
                listing.coordinates.results[0].geometry.location.lng
            ),
            mapContainer = $('#map-detail');

        mapContainer.prepend(template({ listing: listing }));

        var map = new google.maps.Map(
            mapContainer[0],
            _.extend(mapOptions, {
                center: location,
                zoom: 15
            })
        );

        var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: listing.address
        });
    }

    function showMapComplete(listings) {
        var bounds = new google.maps.LatLngBounds(),
            mapContainer = $('#map-detail');

        _.each(listings, function(listing) {
            listing.latLng = new google.maps.LatLng(
                listing.coordinates.results[0].geometry.location.lat,
                listing.coordinates.results[0].geometry.location.lng
            );

            bounds.extend(listing.latLng);
        })

        var map = new google.maps.Map(
            mapContainer[0],
            mapOptions
        );

        var markers = _.map(listings, function(listing) {
            return new google.maps.Marker({
                position: listing.latLng,
                map: map,
                title: listing.address
            });
        });

        map.fitBounds(bounds);
    }
});


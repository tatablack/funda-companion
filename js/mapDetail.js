var template;

$(function() {
    window.addEventListener("message", showMap, false);

    function showMap(event) {
        if (!template) {
            $.when($.get(chrome.extension.getURL('../templates/detail.jade'))).done(function(detailResult) {
                template = jade.compile(detailResult);

                showMap(event);
            });

            return;
        }

        var listing = event.data.listing,
            location = new google.maps.LatLng(
                listing.coordinates.results[0].geometry.location.lat,
                listing.coordinates.results[0].geometry.location.lng
            ),
            mapContainer = $('#map-detail');

        var mapOptions = {
            center: location,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        mapContainer.prepend(template({ listing: listing }));

        var map = new google.maps.Map(
            mapContainer[0],
            mapOptions
        );

        var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: listing.address
        });
    }
});


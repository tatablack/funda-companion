FundaCompanion.Parser = function() {
    var listingSelector = 'li.nvm',
        usernameSelector = '#my-menu-button span',
        pageUrls = _.pluck($('.paging-list a[href!="#"]'), 'href');

    var parseListings = function(selector) {
        return _.map(selector, function(listing) {
            var $listing = $(listing);
            return {
                id: $listing.attr('globalid'),
                link: $listing.find('a').attr('href'),
                imageUrl: $listing.find('img').attr('src'),
                price: $listing.find('.price-wrapper').text(),
                address: $listing.find('.object-street').text().trim(),
                location: $listing.find('.properties-list li:first()').contents()[0].nodeValue.replace(/\s+/gi, ' ').trim(),
                size: $listing.find('span[title="Woonoppervlakte"]').text(),
                rooms: $listing.find('span[title^="Aantal"]').text()
            }
            }
        );
    };

    var getCoordinates = function(listings) {
        var getCoordinatesForListing = function(listing, deferred) {
            $.ajax({
                dataType: 'json',
                url: 'http://maps.googleapis.com/maps/api/geocode/json',

                data: {
                    address: listing.address + ', ' + listing.location,
                    sensor: false
                }
            }).done(function(coordinates) {
                if (coordinates.status === 'OK') {
                    listing.coordinates = coordinates.results[0].geometry.location;
                } else {
                    console.warn(coordinates.status);
                }
            }).always(function() {
                deferred.resolve();
            });
        };

        return _.map(listings, function(listing, index) {
            var result = $.Deferred(),
                username = getUsername();

            chrome.storage.local.get(username, function(savedListings) {
                var currentListing = _.find(savedListings[username], function(savedListing) {
                    return savedListing.id === listing.id;
                });

                if (currentListing && currentListing.coordinates) {
                    result.resolve();
                } else {
                    _.delay(getCoordinatesForListing, 200 * index, listing, result);
                }
            });

            return result.promise();
        })
    };

    var getUsername = function() {
        return $(usernameSelector).text()
    };

    return {
        getListings: function() {
            var result = $.Deferred(),
                listings = parseListings($(listingSelector)),
                allPages = _.map(pageUrls, function(pageUrl) {
                    return $.ajax({
                        url: pageUrl,
                        dataType: 'html'
                    }).done(function(pageContents) {
                        var doc = document.implementation.createHTMLDocument("");
                        doc.body.innerHTML = pageContents;
                        listings = listings.concat(parseListings($(doc.body).find(listingSelector)));
                    });
                });

            $.when.apply($, allPages).done(function() {
                $.when.apply($, getCoordinates(listings)).done(function() {
                    result.resolve(listings);
                })
            });

            return result.promise();
        },

        getUsername: getUsername
    }
};
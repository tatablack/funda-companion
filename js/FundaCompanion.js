// Let's wait for the page to be loaded
// before starting up
$(function() {
    var listings = [],
        parser = new FundaCompanion.Parser();

    FundaCompanion.UI.toggleLoader(true);

    $.when(parser.getListings()).done(function(returnedListings) {
        // Save all listings
        var currentUserListings = {};
        currentUserListings[parser.getUsername()] = returnedListings;
        chrome.storage.local.set(currentUserListings);

        chrome.storage.local.getBytesInUse(parser.getUsername(), function(bytesInUse) {
            console.log('All saved listings are worth ' + bytesInUse + ' bytes');
        })

        listings = returnedListings;
        listings[0].selected = true;
        render();
    });

    function render() {
        FundaCompanion.UI.toggleLoader(false);

        $.when(
            $.get(chrome.extension.getURL('templates/listing.jade'))
        ).done(function(listingResult) {
            var compiledListingTemplate = jade.compile(listingResult)
            $('.col-m').append(compiledListingTemplate({ listings: listings }));

            // We add an iframe to the page,
            // to load the Google Maps API into it
            var iframe = document.createElement('iframe');
            iframe.id = 'ext-map-detail';
            iframe.onload = showDetailMap;
            iframe.src = chrome.extension.getURL('pages/mapDetail.html');

            $('.col-m').append(iframe);
        });
    }

    function showDetailMap() {
        var selectedListing = _.find(listings, function(listing) {
            return listing.selected === true;
        });

        FundaCompanion.UI.showMapComplete(listings);
    }
});

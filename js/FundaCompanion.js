// Let's wait for the page to be loaded
// before starting up
$(function() {
    var listings = [];
    FundaCompanion.UI.toggleLoader(true);

    $.when((new FundaCompanion.Parser()).getListings()).done(function(returnedListings) {
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

// Let's wait for the page to be loaded
// before starting up
$(function() {
    FundaCompanion.UI.toggleLoader(true);

    $.when((new FundaCompanion.Parser()).getListings()).done(function(listings) {
        render(listings);
    });

    // Waits for all ads pages to be scraped,
    // and then renders the whole thing
    function render(listings) {
        FundaCompanion.UI.toggleLoader(false);

        _.each(listings, function(listing) {
            console.dir(listing);
        });
    }
});

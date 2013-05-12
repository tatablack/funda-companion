FundaCompanion.UI = {
    loaderPath: "images/loader.gif",

    toggleLoader: function(visibility) {
        var loader = $('#custom-loader');

        if (loader.length === 0) {
            loader = $('<img id="custom-loader"/>').attr(
                'src',
                chrome.extension.getURL(this.loaderPath)
            ).prependTo($('.col-m'));
        }

        if (visibility) {
            loader.show();
        } else {
            loader.hide();
        }
    },

    showMapDetail: function(selectedListing) {
        $('#ext-map-detail')[0].contentWindow.postMessage(
            {
                method: 'showMapDetail',
                listing: selectedListing
            }, '*'
        )
    },

    showMapComplete: function(listings) {
        $('#ext-map-detail')[0].contentWindow.postMessage(
            {
                method: 'showMapComplete',
                listings: listings
            }, '*'
        )
    }
};
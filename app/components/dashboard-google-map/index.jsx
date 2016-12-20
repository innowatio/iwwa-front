import React from "react";
import GoogleMap from "google-map-react";

import {GOOGLE_MAP_API_KEY} from "lib/config";

var DashboardGoogleMap = React.createClass({
    render: function () {
        return (
            <GoogleMap
                bootstrapURLKeys={{
                    key: GOOGLE_MAP_API_KEY
                }}
                defaultCenter={{lat: 42.0279071, lng: 11.3340147}}
                defaultZoom={4}
            />
        );
    }
});

module.exports = DashboardGoogleMap;
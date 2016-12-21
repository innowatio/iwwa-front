import GoogleMap from "google-map-react";
import React, {PropTypes} from "react";

import {GOOGLE_MAP_API_KEY} from "lib/config";

import SiteMarker from "./site-marker";

var DashboardGoogleMap = React.createClass({
    propTypes: {
        sites: PropTypes.array.isRequired
    },
    renderSitesMarker: function () {
        return this.props.sites.map(site => {
            const latitude = site.latitude;
            const longitude = site.longitude;
            return latitude && longitude ? (
                <SiteMarker
                    lat={latitude}
                    lng={longitude}
                />
            ) : null;
        });
    },
    render: function () {
        return (
            <GoogleMap
                bootstrapURLKeys={{
                    key: GOOGLE_MAP_API_KEY
                }}
                defaultCenter={{lat: 42.0279071, lng: 11.3340147}}
                defaultZoom={4}
            >
                {this.renderSitesMarker()}
            </GoogleMap>
        );
    }
});

module.exports = DashboardGoogleMap;

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
            const {latitude, longitude} = site;
            return latitude && longitude ? (
                <SiteMarker
                    lat={latitude}
                    lng={longitude}
                />
            ) : null;
        });
    },
    render: function () {
        // position: 10 === google.maps.ControlPosition.BOTTOM_LEFT
        return (
            <GoogleMap
                bootstrapURLKeys={{
                    key: GOOGLE_MAP_API_KEY
                }}
                defaultCenter={{lat: 42.0279071, lng: 11.3340147}}
                defaultZoom={5}
                options={{
                    fullscreenControl: true,
                    fullscreenControlOptions: {
                        position: 10
                    }
                }}
            >
                {this.renderSitesMarker()}
            </GoogleMap>
        );
    }
});

module.exports = DashboardGoogleMap;
